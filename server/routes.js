import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import s3_upload from './s3_putobject.js';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { usernamePattern, passwordPattern } from "./accessTokens.js";
import { server_addSound, server_deleteSound, server_getSounds } from "./sounds.js";
import { generateToken, deleteToken, validateToken } from "./accessTokens.js";
import { pool as pgPool, secretKey } from "./postgresql.js";

const fsPromises = fs.promises;
const router = express.Router();

// Multer disk storage configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/server/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage });


/***** SOUNDFILES *****/

// Upload a new audio file to S3
router.post("/soundFiles", upload.single('audioFile'), async function(req, res) {
    console.log(`POST "/soundFiles" request for file: "${req.file.path}" by author: "${req.body.author}"`);

    let response = {"loginValid": false, "uploadSuccess": false, "errorMsg": undefined};

    if(validateToken(req.body.author, req.body.accessToken)) {
        response.loginValid = true;
        if(await s3_upload(req.file.path, 'sounds', req.body.author)) { // Attempt to push file to S3 bucket
            response.uploadSuccess = true;
            if(!server_addSound(path.basename(req.file.path), req.body.author)){ // If successful, add the sound to the server's array
                response.errorMsg = "Server uploaded file, but failed to store it for immediate access";
            }
            res.status(201);
        } else {
            response.errorMsg = "Server encountered an error while uploading to cloud";
            res.status(500);
        }
    } else {
        response.errorMsg = "Username or password is incorrect";
        res.status(200);
    }

    fs.unlinkSync('./server/uploads/' + req.file.originalname); // Delete server's temporary copy of file
    res.send(response);

});

// Update an existing audio file on S3
router.put("/soundFiles", upload.single("audioFile"), async function(req, res) {
    console.log(`PUT "/soundFiles" request for file: ${req.file.path} by author: "${req.body.author}"`);
});

// Delete an audio file from S3
router.delete("/soundFiles/:soundFile", function(req, res) {
    console.log(`DELETE "/soundFiles/${req.params.soundFile} request`);
});

// Get a list of all sound files on S3
router.get("/soundFiles", function(req, res) {
    console.log(`GET "/soundFiles" request`);
    const soundFiles = server_getSounds();
    if(soundFiles) res.status(200).send({"soundFiles": soundFiles});
    else res.status(500).send({"info": "Server error"});
});

// Get a list of all sound files on S3 uploaded by a spcified user
router.get("/soundFiles/:user", function(req, res) {
    console.log(`GET "/soundFiles/${req.params.user}" request`);
    const soundFiles = server_getSounds(req.params.user);
    if(soundFiles) res.status(200).send({"soundFiles": soundFiles});
    else res.status(500).send({"info": "Server error"});
});


/***** USERS *****/

// Create a new user account in database
router.post("/users", async function(req, res) {
    console.log(`POST /createUser request for username: "${req.body.username}", password: "${req.body.password}"`);

    if(req.body.username && req.body.password && usernamePattern.test(req.body.username) && passwordPattern.test(req.body.password)) {
        try {
            const passHash = await argon2.hash(req.body.password);
            pgPool.query(`INSERT INTO users (username, passhash) VALUES ('${req.body.username}', '${passHash}');`, (err, queryRes) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({"info": "Server error while contacting database"});
                } else {
                    res.status(201).end();
                }
            });

        } catch (err) {
            res.status(500).send({"info": "Server error while creating token"});
        }

    } else {
        res.status(401).send({"info": "Username or password is invalid"});
    }
});

// Update a user account in database
router.put('/users', function(req, res) {
});

// Delete a user account in database
router.delete("/users/:user", async function(req, res) {
    console.log(`DELETE "/users/${req.params.user}" request`);
    // FIX: All requests authenticated by JWT need an additional check that the encoded username is still in the database.

    const jwtInput = req.headers["cookie"].split("; ").filter(cookie => cookie.includes("sessionToken"))[0].split("=")[1];

    try {
        let decoded = jwt.verify(jwtInput, secretKey);
        if(decoded.username == req.params.user) {
            pgPool.query(`DELETE FROM users WHERE username = '${req.params.user}';`, async (err, queryRes) => {
                if(err) {
                    console.log(err);
                    res.status(500).end();
                } else {
                    res.clearCookie("sessionToken");
                    res.clearCookie("sessionUsername");
                    res.status(202).end();
                }
            });
        } else {
            res.status(401).end();
        }
    } catch(err) {
        console.log(err);
        res.status(500).end();
    }
});

/***** SESSIONS *****/

// Create a login session by sending client a JWT token
router.post("/sessions", async function(req, res){
    console.log(`POST "/sessions" request for "${req.body.username}"`);

    if(req.body.username && req.body.password && usernamePattern.test(req.body.username) && passwordPattern.test(req.body.password)) {
        
        pgPool.query(`SELECT passhash FROM users WHERE username = '${req.body.username}';`, async (err, queryRes) => {
            if(err) {
                res.status(500);
                res.send({"info": "Database error"});
            } else {
                if(queryRes.rows[0]) {
                    try {
                        if(await argon2.verify(queryRes.rows[0].passhash, req.body.password)) {
                            // User authenticated, send JWT token
                            const token = jwt.sign({
                                username: req.body.username
                            }, secretKey, { expiresIn: '2d'});

                            let expDate = new Date();
                            expDate.setHours(expDate.getHours() + 6);
                            
                            res.cookie("sessionToken", token, { expires: expDate, httpOnly: true });
                            res.cookie("sessionUsername", req.body.username, {expires: expDate});
                            res.status(200).end();
                        } else {
                            res.status(401);
                            res.send({"info": "Incorrect password"});
                        }
                    } catch (err) {
                        console.log(err);
                        res.status(500);
                        res.send({"info": "Server token validation error"});
                    }
                } else {
                    res.status(401);
                    res.send({"info": "User does not exist"});
                }
            }
        });
    } else {
        res.status(401);
        res.send({"info": "Username or password is invalid"});
    }
});

// Delete a session, logging the user out
router.delete("/sessions/:user", function(req, res){
    console.log(`DELETE "/sessions/${req.params.user}" request`);

    res.clearCookie("sessionToken");
    res.clearCookie("sessionUsername");
    res.status(202).end();
});

/***** OTHER REQUESTS *****/

// Send all page routing requests to index, then handle them via React router
router.get("/*", function(req, res) {
    res.sendFile(path.resolve(process.cwd() + "/public/index.html"), function(err) {
        if (err) {
            res.status(500).send(err);
        }
     })
});

/*
router.post('/updateAccount', async function(req, res) {
    var response = {
        uploadStatus: false
    };
    console.log(req.body.username, req.body.password);
    
    let inputValid = req.body.username.length > usernameMinLength && req.body.password.length > passwordMinLength;
    if(inputValid) {
        // Write the account info file to be uploaded to server
        let filePath = `./server/uploads/${req.body.username}.txt`;

        await fsPromises.writeFile(filePath, `${req.body.password}`, err => {
            if (err) { 
                console.error(err);
            }
        });
    
        var uploadStatus = await s3_upload(filePath, 'users'); // Attempt to push file to S3
        if(uploadStatus) console.log('got account uploadStatus in routes.js');
        fs.unlinkSync(filePath); // Delete local copy of file
    
        response.uploadStatus = uploadStatus;
    } else {
        response.uploadStatus = false;
    }

    res.send(response);
});

// Confirm the user's accessToken authentication
router.post("/validateSession", function(req, res) { 
    console.log(`POST: /validateSession request for ${req.body.username}`)
    res.send( {"sessionValid": validateToken(req.body.username, req.body.accessToken)} );
});
*/

export default router;
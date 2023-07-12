import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import s3_upload from './s3_putobject.js';
import s3_delete from './s3_deleteobject.js';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { server_addSound, server_deleteSound, server_getSounds } from "./sounds.js";
import { pool as pgPool, jwtSecretKey } from "./creds.js";

export const usernamePattern = /^[a-zA-Z][A-Za-z0-9_-]{4,24}$/;
export const passwordPattern = /^\S.{4,48}\S$/;
export const titlePattern = /^[a-zA-Z][A-Za-z0-9_\- ]{3,30}$/;
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


/***** HELPER FUNCTIONS *****/

// Takes a request and returns an object literal containing the cookies from its header
function getCookies(req) {
    const cookies = {};
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return cookies;
    cookieHeader.split(";").forEach((cookie) => {
        let [key, value] = cookie.split("=");
        if(!key || !value) return;
        cookies[key.trim()] = value.trim();
    });
    return cookies;
}

function validateRequester(req) {
    const cookies = getCookies(req);
    let decoded = jwt.verify(cookies.sessionUsername);
    if(decoded.username == cookies.sessionUsername) {

    }
}

/***** SOUNDFILES *****/

// Upload a new audio file to S3
router.post("/soundFiles", upload.single('audioFile'), async function(req, res) {
    console.log(`POST "/soundFiles" request for file: "${req.file.path}" by author: "${req.body.author}"`);

    const jwtInput = req.headers["cookie"].split("; ").filter(cookie => cookie.includes("sessionToken"))[0].split("=")[1];
    const username = req.headers["cookie"].split("; ").filter(cookie => cookie.includes("sessionUsername"))[0].split("=")[1];

    if(titlePattern.test(path.basename(req.file.path).split('.')[0])) {
        try {
            let decoded = jwt.verify(jwtInput, jwtSecretKey);
            if(decoded.username == username) {
                console.log(`User valid. Going to attempt upload. Path: "sounds/${req.body.author}/${path.basename(req.file.path)}"`);
                const result = await s3_upload(req.file.path, `sounds/${req.body.author}`);
                console.log(`S3 upload result code: ${result}`);
                switch(result) {
                    case(1): // Upload succeeded
                        console.log(`PostgreSQL command: "INSERT INTO sounds (title, author) VALUES ('${path.basename(req.file.path)}', '${req.body.author}');"`);
                        pgPool.query(`INSERT INTO sounds (title, author) VALUES ('${path.basename(req.file.path)}', '${req.body.author}');`, async (err, queryRes) => {
                            if(err) {
                                console.log(`PostgreSQL error: ${err.code}`);
                                /*
                                switch(err.code) {
                                    case("23505"):
                                        // Account already exists
                                        res.status(409).send({"info": "That username is already taken"});
                                        break;  
                                    default: 
                                        res.status(500).send({"info": "Server error while contacting database"});
                                        break;
                                }
                                */
                            } else {
                                console.log(`PostgreSQL success`);
                            }
                        });
                        if(!server_addSound(path.basename(req.file.path), req.body.author)){ // Add the sound to the server's array
                            console.log("Error: Failed to add sound to server's array");
                        }
                        res.status(201).end();
                        break;
                    case(-1): // File path invalid; Upload failed
                        res.status(500).end();
                        break;
    
                    case(-2): // Destination path invalid; Upload failed
                        res.status(500).end();
                        break;
                    
                    case(-3): // Server failed to connect to S3 for upload
                        res.status(500).end();
                        break;
                }
            } else {
                res.status(401).end();
            }
        } catch(err) {
            console.log(err);
            res.status(500).end();
        }
    } else {
        res.status(400).send({"info": "Invalid sound title"});
    }



    fs.unlinkSync('./server/uploads/' + req.file.originalname); // Delete server's temporary copy of file
});

// Update an existing audio file on S3
router.put("/soundFiles", upload.single("audioFile"), async function(req, res) {
    console.log(`PUT "/soundFiles" request for file: ${req.file.path} by author: "${req.body.author}"`);

    const jwtInput = req.headers["cookie"].split("; ").filter(cookie => cookie.includes("sessionToken"))[0].split("=")[1];
    const username = req.headers["cookie"].split("; ").filter(cookie => cookie.includes("sessionUsername"))[0].split("=")[1];

});

// Delete an audio file from S3
router.delete("/soundFiles/:author/:title", async function(req, res) {
    console.log(`DELETE "/soundFiles/${req.params.author}/${req.params.title } request`);

    const cookies = getCookies(req);
    console.log(cookies);

    try {
        let decoded = jwt.verify(cookies.sessionToken, jwtSecretKey);
        if(decoded.username == cookies.sessionUsername && decoded.username == req.params.author) { 
            // User is authorized to delete file
            const result = await s3_delete(`sounds/${req.params.author}/${req.params.title}`);
            console.log(result);
            switch(result) {
                case(1): // Deletion succeeded
                    pgPool.query(`DELETE FROM sounds WHERE author = '${req.params.author}' AND title = '${req.params.title}';`, async (err, queryRes) => {
                        console.log("QueryRes: ", queryRes);
                    });
                    if(!server_deleteSound(req.params.title, req.params.author)){ // Remove the sound from the server's array
                        console.log("Error: Failed to delete sound from server's array");
                    }
                    res.status(201).end();
                    break;

                case(-2): // Target path invalid; Deletion failed
                    res.status(500).end();
                    break;
                
                case(-3): // Server failed to connect to S3 for deletion
                    res.status(500).end({"info": "Server error while communicating with cloud"});
                    break;
            }
        } else {
            res.status(401).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({"info": "Server failed to read JWT"});
    }

});

// Get a list of sound files constrained by optional parameters
router.get("/soundFiles", function(req, res) {
    console.log(`GET "/soundFiles" request`);

    const limit = req.query.limitTopN;
    const author = req.query.author;
    const authorQueryString = author ? `WHERE author = '${author}'` : "";
    const limitQueryString = limit ? `ORDER BY likes DESC LIMIT ${limit}` : "";

    var soundFiles = [];
    pgPool.query(
        `SELECT * FROM sounds
        ${authorQueryString}
        ${limitQueryString}
        ;`
    , (err, queryRes) => {
        if(err) {
            console.log(`PostgreSQL error: ${err.code}`);
            res.status(500).send({"info": "Server error"});
        } else {
            console.table(queryRes.rows);
            for(var i=0; i<queryRes.rows.length; i++) {
                soundFiles.push({
                    "sid": queryRes.rows[i].sid, 
                    "title": queryRes.rows[i].title, 
                    "author": queryRes.rows[i].author,
                    "likes": queryRes.rows[i].likes
                });
            }
            res.status(200).send({"soundFiles": soundFiles});
        }
    });
});

/***** SOUND FILE LIKES *****/

// Return a boolean indicating whether a given sound has been liked by a given user
router.get("/likes/:sid/:user", function(req, res) {
    console.log(`Checking whether sid ${req.params.sid} has been liked by ${req.params.user}`);
    pgPool.query(
        `SELECT EXISTS ( 
            SELECT 1 FROM user_likes 
            WHERE 
                sid = ${req.params.sid} 
                AND username = '${req.params.user}'
        );`,
    (err, queryRes) => {
        if(err) {
            console.log(`PostgreSQL error: ${err.code}`);
        } else {
            console.log(queryRes.rows[0].exists);
            res.status(200).send({"isLiked": queryRes.rows[0].exists});
        }
    });
});

// Return a list of the sound files a user has liked
router.get("/users/:username/likes", function(req, res) {
    const cookies = getCookies(req);

    if(cookies.sessionToken) {
        try {
            let decoded = jwt.verify(cookies.sessionToken, jwtSecretKey);
            if(decoded.username == req.params.username) {
                pgPool.query(
                    `SELECT * 
                    FROM user_likes JOIN
                        sounds ON user_likes.sid = sounds.sid
                    WHERE
                        user_likes.username = '${req.params.username}';`,
                (err, queryRes) => {
                    if(err) {
                        console.log(`PostgreSQL error: ${err.code}`);
                    } else {
                        let likedSounds = [];
                        for(var i=0; i<queryRes.rows.length; i++) {
                            likedSounds.push(queryRes.rows[i].sid);
                        }
                        res.status(200).send({"likedSounds": likedSounds});
                    }
                });
            } else {
                console.log("Denied: Wrong username");
                res.status(401).end();
            }
        } catch (err) {
            console.log("Denied: JWT decode failed");
            res.status(401).end();
        }
    } else {
        console.log("Denied: Bad JWT");
        res.status(401).send({"info": "Log in to like sounds"});
    }
});

router.put("/soundFiles/:author/:title/likes/:username", function(req, res) {
    const cookies = getCookies(req);

    if(cookies.sessionToken) {
        try {
            let decoded = jwt.verify(cookies.sessionToken, jwtSecretKey);
            if(decoded.username == req.params.username) {
                // Get the sound and its like from this user if applicable
                pgPool.query(
                    `SELECT 
                        sounds.sid,
                        sounds.likes,
                        user_likes.lid,
                        user_likes.username
                    FROM 
                        sounds LEFT JOIN user_likes 
                            ON sounds.sid = user_likes.sid AND user_likes.username = '${req.params.username}'
                    WHERE
                        author = '${req.params.author}'
                        AND title = '${req.params.title}';`,
                (err, queryRes) => {
                    if(err) {
                        res.status(500);
                        console.log(`PostgreSQL error: ${err.code}`);
                        res.send({"info": "Database error"});
                    } else {
                        console.log("Got here");
                        if(queryRes.rows[0]) {
                            // Sound was found in database
                            console.table(queryRes.rows);
                            if(queryRes.rows[0].lid) {
                                // User has already liked the sound; Delete this like
                                pgPool.query(
                                    `DELETE FROM user_likes
                                    WHERE lid = '${queryRes.rows[0].lid}';`,
                                (err, queryRes) => {
                                    if(err) {
                                        res.status(500);
                                        console.log(`PostgreSQL error: ${err.code}`);
                                        res.send({"info": "Database error"});
                                    } else {
                                        console.log("Removed like from user_likes");
                                    }
                                });
                                console.log(1);
                                // Decrement likes by 1
                                pgPool.query(
                                    `UPDATE sounds
                                    SET likes = ${queryRes.rows[0].likes - 1}
                                    WHERE sid = ${queryRes.rows[0].sid};`,
                                (err, queryRes) => {
                                    if(err) {
                                        res.status(500);
                                        console.log(`PostgreSQL error: ${err.code}`);
                                        res.send({"info": "Database error"});
                                    } else {
                                        console.log("Decremented likes by 1");
                                        res.status(200).end();
                                    }
                                });
                                console.log(2);

                            } else {
                                // User has not liked the sound; Create a like
                                pgPool.query(
                                    `INSERT INTO user_likes (username, sid)
                                    VALUES ('${req.params.username}', ${queryRes.rows[0].sid});`,
                                (err, queryRes) => {
                                    if(err) {
                                        res.status(500);
                                        console.log(`PostgreSQL error: ${err.code}`);
                                        res.send({"info": "Database error"});
                                    } else {
                                        console.log("Added like to user_likes");
                                    }
                                });
                                console.log(1);
                                // Increment likes by 1
                                pgPool.query(
                                    `UPDATE sounds
                                    SET likes = ${queryRes.rows[0].likes + 1}
                                    WHERE sid = ${queryRes.rows[0].sid};`,
                                (err, queryRes) => {
                                    if(err) {
                                        res.status(500);
                                        console.log(`PostgreSQL error: ${err.code}`);
                                        res.send({"info": "Database error"});
                                    } else {
                                        console.log("Incremented likes by 1");
                                        res.status(200).end();
                                    }
                                });
                                console.log(2);
                            }
                        } else {
                            console.log("Couldn't find sound in database");
                        }
                    }
                });
            } else {
                console.log("Denied: Wrong username");
                res.status(401).end();
            }
        } catch (err) {
            console.log("Denied: JWT decode failed");
            res.status(401).end();
        }
    } else {
        console.log("Denied: Bad JWT");
        res.status(401).send({"info": "Log in to like sounds"});
    }

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
                    console.log(`PostgreSQL error: ${err.code}`);
                    switch(err.code) {
                        case("23505"):
                            // Account already exists
                            res.status(409).send({"info": "That username is already taken"});
                            break;  
                        default: 
                            res.status(500).send({"info": "Server error while contacting database"});
                            break;
                    }
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
        let decoded = jwt.verify(jwtInput, jwtSecretKey);
        if(decoded.username == req.params.user) {
            pgPool.query(`DELETE FROM users WHERE username = '${req.params.user}';`, async (err, queryRes) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({"info": "Server failed to delete user from database"});
                } else {
                    // Delete the user's associated sounds


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
        res.status(500).send({"info": "Server failed to read JWT"});
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
                console.log(`PostgreSQL error: ${err.code}`);
                res.send({"info": "Database error"});
            } else {
                if(queryRes.rows[0]) {
                    // User found in database
                    try {
                        if(await argon2.verify(queryRes.rows[0].passhash, req.body.password)) {
                            // User authenticated, send JWT token
                            const token = jwt.sign({
                                username: req.body.username
                            }, jwtSecretKey, { expiresIn: '2d'});

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

export default router;
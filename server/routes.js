import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import s3_upload from './s3_putobject.js';
import s3_get from './s3_getobject.js';
import { accessTokens, tokenLength, usernameMinLength, passwordMinLength } from "./accessTokens.js";
import { server_addSound, server_deleteSound, server_getSounds } from "./sounds.js";
import { generateToken } from "./accessTokens.js";
import e from 'express';
const fsPromises = fs.promises;

// Configure multer disk storage 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/server/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });
const router = express.Router();

// Handle a request to upload an array of .wav files to S3
router.post('/uploadAudio', upload.single('audioFile'), async function(req, res) {
    console.log("Upload Audio Request: \n  Filename: " + req.file.path + "\n  Author: " + req.body.author);
    let loginValid = validateAccessToken(req.body.author, req.body.accessToken);
    let uploadSuccess = false;
    if(loginValid) {
        // Attempt to upload the sound to S3 bucket
        uploadSuccess = await s3_upload(req.file.path, 'sounds', req.body.author); // Attempt to push file to S3
        console.log("  Result: " + uploadSuccess);
        // If successful, add the sound to the server's array
        if(uploadSuccess) {
            let storageSuccess = server_addSound(path.basename(req.file.path), req.body.author);
            console.log("  Stored on server: " + storageSuccess);
        }
    }
    fs.unlinkSync('./server/uploads/' + req.file.originalname); // Delete local copy of file

    let response = {"loginValid": loginValid, "uploadSuccess": uploadSuccess}
    res.send(response);
});

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

// Handle a request to stream a .wav file from S3
router.get('/audio', function(req, res) {
    // s3 streaming
});

// 
router.get("/listSounds", async function(req, res) {
    /* TESTING */
    //var dbgUsers = await s3_list("users");
    //console.log(dbgUsers.Contents);

    //var dbgSounds = await s3_list("sounds");

    let sounds = server_getSounds();
    console.log("Sending SERVER's log of sounds...");
    res.send(sounds);
});

// Handle a request to log in
router.post("/login", async function(req, res){
    console.log("Got login request: " + req.body.username + ", " + req.body.password);
    let response = {"loginSuccess" : false, "accessToken" : null};

    if(req.body.username && req.body.password && req.body.username.length >= usernameMinLength && req.body.password.length >= passwordMinLength) {
        let fileName = req.body.username + ".txt";
        let userPass = await s3_get(fileName, "users");
    
        if(req.body.password === userPass) {
            response.loginSuccess = true;
            response.accessToken = generateToken(req.body.username);
            console.log(accessTokens);
        }
    } else {
        console.log("Invalid login input.");
    }

    res.send(response);
});

function validateAccessToken(username, accessToken) {
    let isValid = false;
    if(username && accessToken && username.length > 0 && accessToken.length == tokenLength) {
        isValid = (accessTokens[username] === accessToken);
    }
    return isValid;
}

router.post("/validateUser", function(req, res) {
    console.log(req.body);
    let givenAccessToken = req.body.accessToken;
    let givenUsername = req.body.username;
    console.log("Validating login for " + givenAccessToken + ", " + givenUsername + "...");
    
    let isValid = validateAccessToken(givenUsername, givenAccessToken);

    res.send(isValid);
});

// Send all page routing requests to index, then handle them via React router
router.get("/*", function(req, res) {
    res.sendFile(path.resolve(process.cwd() + "/public/index.html"), function(err) {
        if (err) {
            res.status(500).send(err);
        }
     })
});

export default router;
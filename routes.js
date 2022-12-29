import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import s3_upload from './s3_putobject.js';
import s3_list from './s3_listobjects.js';
const fsPromises = fs.promises;

// Configure multer disk storage 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });

var router = express.Router();

// Handle a request to upload an array of .wav files to S3
router.post('/uploadAudio', upload.array('audioFile', 5), async function(req, res) {
    var response = {
        uploadStatuses: []  // Information on the successfulness of uploading each file; -1 = failure, 1 = success
    };

    for(var i=0; i<req.files.length; i++) {

        var uploadStatus = await s3_upload(req.files[i].path, 'sounds'); // Attempt to push file to S3
        if(uploadStatus) console.log('got sound uploadStatus in routes.js');
        response.uploadStatuses.push(uploadStatus);

        fs.unlinkSync('./uploads/' + req.files[i].originalname); // Delete local copy of file
    }

    res.send(response);
});

router.post('/updateAccount', async function(req, res) {
    var response = {
        uploadStatus: 0
    };
    // Write the account info file to be uploaded to server
    var filePath = `./uploads/${req.body.username}.txt`;
    await fsPromises.writeFile(filePath, `${req.body.password}`, err => {
        if (err) { 
            console.error(err);
        }
    });

    var uploadStatus = await s3_upload(filePath, 'users'); // Attempt to push file to S3
    if(uploadStatus) console.log('got account uploadStatus in routes.js');
    fs.unlinkSync(filePath); // Delete local copy of file

    response.uploadStatus = uploadStatus;
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

    var dbgSounds = await s3_list("sounds");

    console.log(dbgSounds.Contents);
    res.send(dbgSounds);
});

// Handle a request to log in
router.post('/login', function(req, res){
    console.log('Got login request');
    let content = {'data' : 'The server recieved your login request!'};
    res.send(content)
    console.log('  Sent response')
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
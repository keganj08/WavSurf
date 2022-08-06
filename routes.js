import express from 'express';
import multer from 'multer';
import fs from 'fs';
import s3_upload from './s3_putobject.js';

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

        var uploadStatus = await s3_upload(req.files[i].path);
        console.log('got uploadStatus in routes.js');
        response.uploadStatuses.push(uploadStatus);

        // If S3 upload was successful, delete the file from temp storage on server
        if(response.uploadStatuses[i] == 1) { fs.unlinkSync('./uploads/' + req.files[i].originalname); } 
    }

    res.send(response);
});

// Handle a request to stream a .wav file from S3
router.get('/audio', function(req, res) {
    // s3 streaming
});


// Handle a request to log in
router.post('/login', function(req, res){
    console.log('Got login request');
    let content = {'data' : 'The server recieved your login request!'};
    res.send(content)
    console.log('  Sent response')
});

export default router;
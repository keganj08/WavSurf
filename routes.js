import express from 'express';
import { s3Client } from './libs/s3Client.js'; 
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import s3_upload from './s3_putobject.js';
import { getSystemErrorMap } from 'util';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extension
    }
})
const upload = multer({ storage: storage });

var router = express.Router();

router.post('/uploadAudio', upload.array('audioFile', 5), async function(req, res) {
    for(var i=0; i<req.files.length; i++) {
        console.log(req.files[i].path);
        var uploadStatus = await s3_upload(req.files[i].path);

        if(uploadStatus[0] == 1) {
            fs.unlinkSync('./uploads/' + req.files[i].originalname);
            console.log('Server knows that upload succeeded, and it deleted its copy of the file.');
        } else {
            console.log('Server received S3 upload error:', uploadStatus[1]);
        }
    }

    /*var response = {'data' : 'response success'};
    res.send(response);*/
});

router.get('/audio', function(req, res) {
    // s3 streaming
});

router.post('/login', function(req, res){
    console.log('Got login request');
    let content = {'data' : 'The server recieved your login request!'};
    res.send(content)
    console.log('  Sent response')
});

export default router;
import express from 'express';
import { s3Client } from './libs/s3Client.js'; 
import multer from 'multer';
import s3_upload from './s3_putobject.js';

const upload = multer({ dest: 'uploads/' });

var router = express.Router();

router.post('/uploadAudio', upload.array('audioFile', 5), function(req, res) {
    for(var i=0; i<req.files.length; i++) {
        console.log(req.files[i].path);
        s3_upload(req.files[i].path);
    }
    //s3_upload(req.files[0]);
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
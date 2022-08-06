import express from 'express';
import { s3Client } from './libs/s3Client.js'; 
import multer from 'multer';

const upload = multer({dest: '/uploads'});

var router = express.Router();

router.post('/uploadAudio', upload.single('audioFile1'), function(req, res) {
    console.log(req.file);
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
const express = require('express');
//const path = require('path');
const routes = require('./routes.js');
var cors = require('cors');


//const bucketLister = require('./s3_listbuckets.js');
const bucketUploader = require('./s3_upload.js');


const app = express();
const port = 3001;

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
const { EMRServerless } = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});


app.use(cors());
app.use(express.static('public')); // Serve static pages from /public
app.use('/', routes) // Handle requests using router

app.listen(port, () => {
    console.log(`WavSurf app listening on port ${port}`)
})
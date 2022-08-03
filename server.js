const express = require('express');
//const path = require('path');
var routes = require('./routes.js');
var cors = require('cors');
const app = express();
const port = 3001;

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});


app.use(cors());
app.use(express.static('public')); // Serve static pages from /public
app.use('/', routes) // Handle requests using router

app.listen(port, () => {
    console.log(`WavSurf app listening on port ${port}`)
})
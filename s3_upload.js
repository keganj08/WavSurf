// Load the AWS SDK for node.js
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

// Create an S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-1'});

// call S3 to retrieve upload file to specified bucket
var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
var file = process.argv[3];

// Configure the file stream and obtain the upload parameters
var fs = require('fs');

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";
import * as path from "path";
import * as fs from "fs";

var file = process.argv[2];
const fileStream = fs.createReadStream(file);

export const uploadParams = {
    Bucket: "wavsurf-files",
    Key: path.basename(file),
    Body: fileStream,
};

export const run = async () => {
    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("Success:", data);
        return data;
    } catch (err) {
        console.log("Error:", err);
    }
};

run();

/*
// Load the AWS SDK for node.js
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// Create an S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-1'});

var path = require('path');
var fs = require('fs');

const file = "./testing.txt";
const fileStream = fs.createReadStream(file);

var uploadParams = {
    Bucket: "wavsurf-files",
    Key: path.basename(file),
    Body: fileStream,
};

s3.putObject(uploadParams, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);  
});
*/

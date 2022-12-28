import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";
import * as path from "path";
import * as fs from "fs";

const run = async (reqParams) => {
    try {
        const data = await s3Client.send(new ListObjectsV2Command(reqParams))
        console.log("S3 success");
        return data;
    } catch (err) {
        console.log("S3 error:", err);
        return -1;
    }
};

export default function listFiles(folder) {
    const reqParams = {
        Bucket: "wavsurf-files",
        Prefix: `${folder}/`,
    }

    return run(reqParams);
}

/*
function listObjectsInBucket(bucketName, fileName) {

    // Create the parameters for calling listObjects
    var bucketParams = {
        Bucket : bucketName,
    };
    
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data);
        }
    });
}
*/
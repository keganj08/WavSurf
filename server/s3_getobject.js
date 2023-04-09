import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";
import * as path from "path";
import * as fs from "fs";

var key = process.argv[2];

const run = async (reqParams) => {
    try {
        // Helper function to convert a ReadableStream to a string
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            });
        
        // Get the object from the S3 bucket
        const data = await s3Client.send(new GetObjectCommand(reqParams));

        // Convert the object's ReadableStream to a string
        const bodyContents = await streamToString(data.Body);
        //console.log(data.Body);
        //console.log(bodyContents);
        return bodyContents;
        
    } catch (err) {
        console.log("Error:", err);
    }
};

export default function getObject(fileName, folder) {
    
    console.log('S3: Retrieving ' + folder + '/' + fileName);

    let reqParams = {
        Bucket: "wavsurf-files",
        Key: folder + '/' + fileName,
    };

    return(run(reqParams));
};


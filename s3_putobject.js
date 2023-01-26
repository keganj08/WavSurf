import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";
import * as path from "path";
import * as fs from "fs";

const run = async (reqParams) => {
    try {
        const data = await s3Client.send(new PutObjectCommand(reqParams));
        //console.log("S3 success:", data);
        return true;
    } catch (err) {
        //console.log("S3 error:", err);
        return false;
    }
};

export default function uploadFile(filePath, destFolder, subFolder) {
    var fileBody = null;
    var fileType = path.basename(filePath).split(".")[1]; // Get file's extension to know how to send its contents to S3
    if(fileType.toLowerCase() == "txt") {
        fileBody = fs.readFileSync(filePath, "utf8", function(err, data){
            if(err) {
                console.log("Error:", err);
            }
        });
    } else if(fileType.toLowerCase() == "wav") {
        fileBody = fs.createReadStream(filePath);
    } else {
        console.log(`Error: Attempted to upload file with invalid extension ".${fileType}" to S3`);
    }

    //console.log("S3: Uploading " + filePath + " into " + destFolder + "/" + subFolder + "/");

    const reqParams = {
        Bucket: "wavsurf-files",
        Key: destFolder + '/' + subFolder + '/' + path.basename(filePath),
        Body: fileBody,
    };

    return run(reqParams);
}
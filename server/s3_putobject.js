import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";
import * as path from "path";
import * as fs from "fs";

const run = async (reqParams) => {
    try {
        const data = await s3Client.send(new PutObjectCommand(reqParams));
        return 1; // Success
    } catch (err) {
        console.log("S3 error", err);
        return -3; // S3 error
    }
};

export default function uploadFile(filePath, destPath) {
    const destPathPattern = /^([a-zA-Z0-9!\-_.*'()]{1,50}\/)+[a-zA-Z0-9!\-_.*'()]{1,50}$/;

    if(destPathPattern.test(destPath)) {
        let fileBody = null;
        let fileType = path.basename(filePath).split(".")[1]; // Get file's extension to know how to send its contents to S3
        switch(fileType.toLowerCase()) {
            case("txt"):
                fileBody = fs.readFileSync(filePath, "utf8", function(err, data){
                    if(err) console.log("Error:", err);
                });
                console.log("S3: Got txt file.");
                break;
            case("wav"):
                fileBody = fs.createReadStream(filePath);
                console.log("S3: Got wav file.");
                break;
            default:
                return -1; // Invalid file path
        }
    
        const reqParams = {
            Bucket: "wavsurf-files",
            Key: `${destPath}/${path.basename(filePath)}`,
            Body: fileBody,
        };

        return run(reqParams);
    } else {
        return -2; // Invalid destination path
    }
}
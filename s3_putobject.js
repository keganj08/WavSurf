import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";
import * as path from "path";
import * as fs from "fs";

const run = async (uploadParams) => {
    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("Success:", data);
        return [1, data];
    } catch (err) {
        console.log("Error:", err);
        return [-1, err];
    }
};

export default function uploadFile(fileName) {
    console.log('S3: Recieved upload request for', fileName);
    const fileStream = fs.createReadStream(fileName);

    const uploadParams = {
        Bucket: "wavsurf-files",
        Key: path.basename(fileName),
        Body: fileStream,
    };

    return run(uploadParams);
}
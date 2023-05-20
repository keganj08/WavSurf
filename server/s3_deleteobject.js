import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

const run = async (reqParams) => {
    try {
        const data = await s3Client.send(new DeleteObjectCommand(reqParams))
        return 1; // Success
    } catch (err) {
        console.log("S3 error:", err);
        return -3; // S3 error
    }
};

export default function deleteObject(keyPath) {
    const keyPathPattern = /^([a-zA-Z0-9!\-_.*'() ]{1,50}\/)+[a-zA-Z0-9!\-_.*'() ]{1,50}$/;

    if(keyPathPattern.test(keyPath)){
        const reqParams = {
            Bucket: "wavsurf-files",
            Key: keyPath,
        }
        return run(reqParams);
    } else {
        return -2; // Invalid target path
    }
}

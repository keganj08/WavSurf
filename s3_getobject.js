import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";

var key = process.argv[2];

export const bucketParams = {
    Bucket: "wavsurf-files",
    Key: key,
};

export const run = async () => {
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
        const data = await s3Client.send(new GetObjectCommand(bucketParams));

        // Convert the objecct's ReadableStream to a string
        const bodyContents = await streamToString(data.Body);
        console.log(data.Body);
        console.log(bodyContents);
        return bodyContents;
        
    } catch (err) {
        console.log("Error:", err);
    }
};
run();

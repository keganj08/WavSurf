import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";
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
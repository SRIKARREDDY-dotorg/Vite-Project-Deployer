import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXX',
    endpoint: 'https://s3.us-east-1.amazonaws.com'
});

export const uploadFile = async (fileName: string, localFilePath: string) => {

    console.log("Called Upload");
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-project-clone",
        Key: fileName
    }).promise();

    console.log(response); 
}
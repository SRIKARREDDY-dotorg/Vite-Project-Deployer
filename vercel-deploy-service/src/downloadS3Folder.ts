import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: "AKIAZI2LFW3UTTZ2UEB6",
    secretAccessKey: "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",
    endpoint: "https://s3.us-east-1.amazonaws.com"
})

// output/asdasd
export async function downloadS3Folder(prefix: string) {
    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel-project-clone",
        Prefix: prefix
    }).promise();
    
    //
    console.log(allFiles); 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                console.log("resolving without the data");
                resolve("");
                return;
            }
            
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            console.log(`final output path ${finalOutputPath}`);
             
            if (!fs.existsSync(dirName)){
                console.log(`No dir create new one`);
                fs.mkdirSync(dirName, { recursive: true });
            }

            
            s3.getObject({
                Bucket: "vercel-project-clone",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                console.log(`Resolving successfully`);
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}
import express from "express";
import {S3} from "aws-sdk";

const s3 = new S3({
    accessKeyId: 'AKIAZI2LFW3UTTZ2UEB6',
    secretAccessKey: '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',
    endpoint: 'https://s3.us-east-1.amazonaws.com'    
});

const app = express();

app.get('/*', async (req, res) => {
    const host = req.hostname;
    console.log(host);
    const id = host.split(".")[0];
    console.log(id);

    const filePath = req.path;
    const contents = await s3.getObject({
        Bucket: "vercel-project-clone",
        Key: `dist/${id}${filePath}`
    }).promise();

    const type = filePath.endsWith("html")? "text/html": filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);

    res.send(contents.Body);
});

app.listen(3001);
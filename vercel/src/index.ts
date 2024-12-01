import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./files";
import { uploadFile } from "./uploadFiles";
import { publishMessageToSNS } from "./publishFiles";
import { addRecord, getRecord } from "./ddbClient";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate();
 
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    console.log(files);
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length+1), file);
    })

    new Promise((resolve) => setTimeout(resolve, 5000));

    publishMessageToSNS(id);

    await addRecord('vercel', {id: id, status: 'uploaded'});

    res.json({
        id: id
    });
})

app.get('/status', async (req, res) => {
    const id = req.query.id;
    
    const response = await getRecord('vercel', {id: id});
    console.log(response);
    res.json({
        status: response?.Item?.status
    });
});

app.get('/', (req, res) => {
    res.json({
        message: "Hello wells!"
    });
})

app.listen(3000);
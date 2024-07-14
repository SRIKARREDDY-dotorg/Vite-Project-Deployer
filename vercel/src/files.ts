import fs from "fs";
import path from "path";

// AKIAZI2LFW3UTTZ2UEB6
// mEPMhsG5ZP7mdbsm6GLBlpMA74jRXmJjZrcak2W1

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);

    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if(fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });

    return response;
}
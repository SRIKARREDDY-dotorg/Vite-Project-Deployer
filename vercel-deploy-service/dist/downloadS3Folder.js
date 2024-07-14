"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadS3Folder = downloadS3Folder;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "AKIAZI2LFW3UTTZ2UEB6",
    secretAccessKey: "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",
    endpoint: "https://s3.us-east-1.amazonaws.com"
});
// output/asdasd
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log(prefix);
        const allFiles = yield s3.listObjectsV2({
            Bucket: "vercel-project-clone",
            Prefix: prefix
        }).promise();
        //
        console.log(allFiles);
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map((_a) => __awaiter(this, [_a], void 0, function* ({ Key }) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (!Key) {
                    console.log("resolving without the data");
                    resolve("");
                    return;
                }
                const finalOutputPath = path_1.default.join(__dirname, Key);
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                const dirName = path_1.default.dirname(finalOutputPath);
                console.log(`final output path ${finalOutputPath}`);
                if (!fs_1.default.existsSync(dirName)) {
                    console.log(`No dir create new one`);
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "vercel-project-clone",
                    Key
                }).createReadStream().pipe(outputFile).on("finish", () => {
                    console.log(`Resolving successfully`);
                    resolve("");
                });
            }));
        }))) || [];
        console.log("awaiting");
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter(x => x !== undefined));
    });
}
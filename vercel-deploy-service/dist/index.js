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
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const downloadS3Folder_1 = require("./downloadS3Folder");
const buildProject_1 = require("./buildProject");
const uploadS3Files_1 = require("./uploadS3Files");
const ddbClient_1 = require("./ddbClient");
const sqs = new aws_sdk_1.SQS({
    accessKeyId: 'AKIAZI2LFW3UTTZ2UEB6',
    secretAccessKey: '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',
    region: 'us-east-1'
});
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/637423433449/vercel-queue';
function pollMessages() {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1, // Maximum number of messages to retrieve
        WaitTimeSeconds: 20 // Long polling time (20 seconds is the maximum)
    };
    sqs.receiveMessage(params, (error, data) => {
        if (error) {
            console.error('Error receiving messages', error);
        }
        else if (data.Messages) {
            console.log('Messages received', data.Messages);
            data.Messages.forEach((message) => __awaiter(this, void 0, void 0, function* () {
                console.log('Processing message:', message.Body);
                // @ts-ignore
                const messageBody = JSON.parse(message.Body);
                // Extract the actual message
                const id = messageBody.Message;
                console.log('Actual message', id);
                if (typeof message.ReceiptHandle === 'string') {
                    const deleteParams = {
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    };
                    sqs.deleteMessage(deleteParams, (deleteErr, deleteData) => {
                        if (deleteErr) {
                            console.error('Error deleting message', deleteErr);
                        }
                        else {
                            console.log('Message deleted', deleteData);
                        }
                    });
                }
                yield (0, downloadS3Folder_1.downloadS3Folder)(`output/${id}`);
                console.log("Downloaded");
                yield (0, buildProject_1.buildProject)(id);
                console.log("Built project successfully");
                yield (0, uploadS3Files_1.copyFinalDist)(id);
                console.log("Copied the build artifacts to s3");
                yield (0, ddbClient_1.updateRecord)('vercel', { id: id }, 'set #status = :status', { ':status': 'deployed' }, { '#status': 'status' });
            }));
        }
        else {
            console.log("No messages received");
        }
        pollMessages();
    });
}
pollMessages();

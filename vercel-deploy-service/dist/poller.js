"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollMessages = pollMessages;
const aws_sdk_1 = require("aws-sdk");
const sqs = new aws_sdk_1.SQS({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXX',
    region: 'us-east-1'
});
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/637423433449/vercel-queue';
function pollMessages() {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10, // Maximum number of messages to retrieve
        WaitTimeSeconds: 20 // Long polling time (20 seconds is the maximum)
    };
    sqs.receiveMessage(params, (error, data) => {
        if (error) {
            console.error('Error receiving messages', error);
        }
        else if (data.Messages) {
            console.log('Messages received', data.Messages);
            data.Messages.forEach((message) => {
                console.log('Processing message:', message.Body);
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
            });
        }
        else {
            console.log("No messages received");
        }
        pollMessages();
    });
}

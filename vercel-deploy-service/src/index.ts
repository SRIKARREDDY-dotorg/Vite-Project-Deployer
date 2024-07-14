import { SQS } from "aws-sdk";
import { downloadS3Folder } from "./downloadS3Folder";
import { buildProject } from "./buildProject";
import { copyFinalDist } from "./uploadS3Files";
import { updateRecord } from "./ddbClient";

const sqs = new SQS({
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
    }

    sqs.receiveMessage(params, (error, data) => {
        if(error) {
            console.error('Error receiving messages', error);
        } else if(data.Messages) {
            console.log('Messages received', data.Messages);

            data.Messages.forEach(async (message) => {
                console.log('Processing message:', message.Body);

                // @ts-ignore
                const messageBody = JSON.parse(message.Body);
                    
                    // Extract the actual message
                const id = messageBody.Message;
                
                console.log('Actual message', id);

                if(typeof message.ReceiptHandle === 'string') {
                    const deleteParams = {
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    };
                    sqs.deleteMessage(deleteParams, (deleteErr, deleteData) => {
                        if (deleteErr) {
                            console.error('Error deleting message', deleteErr);
                        } else {
                            console.log('Message deleted', deleteData);
                        }
                    });
                }

                await downloadS3Folder(`output/${id}`);
                console.log("Downloaded");
                await buildProject(id);
                console.log("Built project successfully");
                await copyFinalDist(id);
                console.log("Copied the build artifacts to s3");
                await updateRecord('vercel', {id: id}, 'set #status = :status', { ':status': 'deployed'}, { '#status': 'status' });
            });
        } else {
            console.log("No messages received");
        }
        pollMessages();
    });
}

pollMessages();
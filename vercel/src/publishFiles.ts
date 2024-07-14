import {SNS} from "aws-sdk";

const sns = new SNS({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXX',
    region: 'us-east-1',
    endpoint: 'https://sns.us-east-1.amazonaws.com'
})

function generateAlphaNumericId() {
    const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let dedupId = '';
    for (let i = 0; i < 10; i++) {
        dedupId += alphanumericCharacters.charAt(Math.floor(Math.random() * alphanumericCharacters.length));
    }
    return dedupId;
}

export function publishMessageToSNS(message: string) {

    const messageGroupId = 'project-artifacts';
    const messageDeduplicationId = generateAlphaNumericId(); // Generate alphanumeric deduplication ID

    const params = {
        Message: message,
        TopicArn: 'arn:aws:sns:us-east-1:637423433449:vercel.fifo',
        MessageGroupId: messageGroupId,
        MessageDeduplicationId: messageDeduplicationId
    }

    const publishTextPromise = sns.publish(params).promise();

    publishTextPromise.then(
        function(data) {
            console.log(`Message "${params.Message}" sent to the topic ${params.TopicArn}`);
            console.log("MessageID is " + data.MessageId);
        }).catch(
        function(err) {
            console.error(err, err.stack);
        });
}
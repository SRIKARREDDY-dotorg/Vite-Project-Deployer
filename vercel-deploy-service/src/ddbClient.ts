import {DynamoDB} from "aws-sdk";

const ddb = new DynamoDB({
    accessKeyId: 'AKIAZI2LFW3UTTZ2UEB6',
    secretAccessKey: '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',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1'
});

const documentClient = new DynamoDB.DocumentClient({ service: ddb });

export const updateRecord = async (tableName: any, key: any, updateExpression: any, expressionAtrributeValues: any, expressionAttributeNames: any) => {
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAtrributeValues,
        ExpressionAttributeNames: expressionAttributeNames
    };

    try {
        await documentClient.update(params).promise();
        console.log("Record updated successfully");
    } catch (error) {
        console.log("Error updating record", error);
    }
    
}
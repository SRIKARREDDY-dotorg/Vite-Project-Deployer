import {DynamoDB} from "aws-sdk";

const ddb = new DynamoDB({
    accessKeyId: 'AKIAZI2LFW3UTTZ2UEB6',
    secretAccessKey: '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',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1'
});

const documentClient = new DynamoDB.DocumentClient({ service: ddb });

export const addRecord = async (tableName: string, item: { id: string; status: string; }) => {
    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        await documentClient.put(params).promise();
        console.log('Record added successfully');
    } catch (error) {
        console.error('Error adding record:', error);
    }
}

export const getRecord = async (tableName: string, id: any) => {
    const params = {
        TableName: tableName,
        Key: id
    };

    try {
        const result = await documentClient.get(params).promise();
        console.log("Record read successfully");
        return result;
    } catch (error) {
        console.log("Error reading record:", error);
    }
    
}
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
exports.updateRecord = void 0;
const aws_sdk_1 = require("aws-sdk");
const ddb = new aws_sdk_1.DynamoDB({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXX',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1'
});
const documentClient = new aws_sdk_1.DynamoDB.DocumentClient({ service: ddb });
const updateRecord = (tableName, key, updateExpression, expressionAtrributeValues, expressionAttributeNames) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAtrributeValues,
        ExpressionAttributeNames: expressionAttributeNames
    };
    try {
        yield documentClient.update(params).promise();
        console.log("Record updated successfully");
    }
    catch (error) {
        console.log("Error updating record", error);
    }
});
exports.updateRecord = updateRecord;

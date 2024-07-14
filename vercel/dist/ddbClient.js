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
exports.getRecord = exports.addRecord = void 0;
const aws_sdk_1 = require("aws-sdk");
const ddb = new aws_sdk_1.DynamoDB({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXX',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1'
});
const documentClient = new aws_sdk_1.DynamoDB.DocumentClient({ service: ddb });
const addRecord = (tableName, item) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName,
        Item: item
    };
    try {
        yield documentClient.put(params).promise();
        console.log('Record added successfully');
    }
    catch (error) {
        console.error('Error adding record:', error);
    }
});
exports.addRecord = addRecord;
const getRecord = (tableName, id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName,
        Key: id
    };
    try {
        const result = yield documentClient.get(params).promise();
        console.log("Record read successfully");
        return result;
    }
    catch (error) {
        console.log("Error reading record:", error);
    }
});
exports.getRecord = getRecord;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
exports.awsS3DeleteImage = (imageKey) => {
    const s3 = config_1.default.s3;
    s3.deleteObject({
        Bucket: config_1.default.aws_bucket,
        Key: imageKey
    }).promise();
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.default = {
    secret: (_a = process.env.SECRET_TOKEN) !== null && _a !== void 0 ? _a : '',
    s3: new s3_1.default({
        accessKeyId: process.env.AWS_KEI_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_DEFAULT_REGION
    }),
    aws_bucket: (_b = process.env.AWS_BUCKET) !== null && _b !== void 0 ? _b : '',
    mail: {
        host: process.env.MAIL_HOST,
        port: (_c = process.env.MAIL_PORT) !== null && _c !== void 0 ? _c : '',
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS
    }
};

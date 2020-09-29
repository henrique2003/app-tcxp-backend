"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const nodemailer_1 = require("nodemailer");
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const config_1 = __importDefault(require("../config/config"));
const { host, port, user, pass } = config_1.default.mail;
const transport = nodemailer_1.createTransport(nodemailer_smtp_transport_1.default({
    host,
    port: parseInt(port),
    auth: {
        user,
        pass
    }
}));
const handlebarOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: path_1.default.resolve('./src/resources/mail/'),
        layoutsDir: path_1.default.resolve('./src/resources/mail/'),
        defaultLayout: ''
    },
    viewPath: path_1.default.resolve('./src/resources/mail/'),
    extName: '.html'
};
transport.use('compile', nodemailer_express_handlebars_1.default(handlebarOptions));
exports.default = transport;

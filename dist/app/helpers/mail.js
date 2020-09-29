"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = __importDefault(require("../../modules/mailer"));
exports.emailConfirmation = (user) => {
    try {
        const { email, name, emailConfirmationCode: code } = user;
        const message = {
            to: email,
            from: 'contato@tcxp.com',
            template: 'auth/emailConfirmation.ts',
            context: { name, code }
        };
        mailer_1.default.sendMail(message, (error) => {
            if (error) {
                console.log(error);
            }
            return false;
        });
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.forgotPassword = (user) => {
    try {
        const { email, name, forgotPasswordToken: token } = user;
        const message = {
            to: email,
            from: 'contato@tcxp.com',
            template: 'auth/forgotPassword.ts',
            context: { name, token }
        };
        mailer_1.default.sendMail(message, (error) => {
            if (error) {
                console.log(error);
            }
            return false;
        });
        return true;
    }
    catch (error) {
        return false;
    }
};

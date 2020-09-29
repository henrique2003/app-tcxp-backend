"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const middlewares_1 = require("../middlewares");
const multer_s3_1 = __importDefault(require("../middlewares/multer-s3"));
const routes = express_1.Router();
// List all Users
// Index
routes.get('/users', user_controller_1.default.index);
// Store
routes.post('/users', user_controller_1.default.store);
// Show
routes.get('/user/:id', user_controller_1.default.show);
// Update
routes.put('/users', middlewares_1.auth, middlewares_1.emailConfirmation, multer_s3_1.default.single('file'), user_controller_1.default.update);
// Destroy
routes.delete('/users', middlewares_1.auth, user_controller_1.default.destroy);
// Email Confirmation
routes.post('/email/confirmation', middlewares_1.auth, user_controller_1.default.emailConfirmation);
// Resend email confirmation
routes.get('/email/confirmation/resend', middlewares_1.auth, user_controller_1.default.emailConfirmationResend);
// Forgot password
routes.post('/forgot/password', user_controller_1.default.forgotPassword);
// Forgot password confirm
routes.post('/forgot/password/confirm', user_controller_1.default.forgotPasswordConfirm);
// Avaliate any user
routes.put('/users/avaliate/:id', middlewares_1.auth, middlewares_1.emailConfirmation, user_controller_1.default.avaliate);
exports.default = routes;

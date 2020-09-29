"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../../config/config"));
const user_1 = require("../models/user");
const helpers_1 = require("../helpers");
const errors_1 = require("../errors");
exports.auth = async (req, res, next) => {
    const authHeaders = req.header('Authorization');
    if (!authHeaders)
        return res.status(401).json(helpers_1.responseWithToken(errors_1.notFound('Token')));
    try {
        // Validate token
        const decoded = jsonwebtoken_1.verify(authHeaders, config_1.default.secret);
        req.userId = decoded.id;
        return next();
    }
    catch (error) {
        try {
            const tokenDecoded = jsonwebtoken_1.decode(authHeaders);
            const user = await user_1.User.findById(tokenDecoded.id);
            // Remenber user
            if (user && user.rememberMe === true) {
                req.newToken = helpers_1.generateToken(user.id);
                const decoded = jsonwebtoken_1.decode(req.newToken);
                req.userId = decoded.id;
                return next();
            }
            return res.status(401).json(helpers_1.responseWithToken('Token inválido'));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
};

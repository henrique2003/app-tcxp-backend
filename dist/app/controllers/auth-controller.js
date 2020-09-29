"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const models_1 = require("../models");
const utils_1 = require("../../utils");
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
class AuthController {
    async login(req, res) {
        try {
            const { body } = req;
            const { email, password } = body;
            req.body = utils_1.cleanFields(body);
            const requiredFields = ['email', 'password'];
            if (!utils_1.isValidFields(requiredFields, body)) {
                return res.status(400).json(errors_1.missingParamError());
            }
            const user = await models_1.User.findOne({ email }).select('+password');
            if (!user || !await bcrypt_1.compare(password, user.password)) {
                return res.status(400).json('Usário ou senha incorreto');
            }
            Object.assign({}, user, { password: undefined });
            return res.status(200).json(helpers_1.responseWithToken(user, helpers_1.generateToken(user.id)));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async loadUser(req, res) {
        try {
            const { userId, newToken } = req;
            const user = await models_1.User.findById(userId);
            return res.status(200).json(helpers_1.responseWithToken(user, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
}
exports.default = new AuthController();

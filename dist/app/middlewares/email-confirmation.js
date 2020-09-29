"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfirmation = void 0;
const models_1 = require("../models");
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
exports.emailConfirmation = async (req, res, next) => {
    try {
        const { newToken } = req;
        if (!await models_1.User.findOne({ _id: req.userId, emailConfirmation: true })) {
            return res.status(401).json(helpers_1.responseWithToken('Necessário comfirmar email', newToken));
        }
        next();
    }
    catch (error) {
        return res.status(500).json(errors_1.serverError());
    }
};

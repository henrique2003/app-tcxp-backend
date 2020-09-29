"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
const utils_1 = require("../../utils");
class DenounceController {
    async index(req, res) {
        try {
            const { newToken, query } = req;
            const { page = 1 } = query;
            const options = {
                perPage: page,
                limit: 5,
                populate: 'to from'
            };
            const denounces = await models_1.Denounce.paginate({}, options);
            return res.status(200).json(helpers_1.responseWithToken(denounces, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async store(req, res) {
        try {
            const { body, userId, params, newToken } = req;
            const { id } = params;
            const requiredFields = ['denounce'];
            if (!utils_1.isValidFields(requiredFields, body)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError(), newToken));
            }
            if (!id) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError(), newToken));
            }
            if (!await models_1.User.findById(id)) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('User'), newToken));
            }
            body.to = userId;
            body.from = id;
            const newDenounce = await models_1.Denounce.create(body);
            return res.status(200).json(helpers_1.responseWithToken(newDenounce, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
}
exports.default = new DenounceController();

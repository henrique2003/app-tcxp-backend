"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInGroup = void 0;
const models_1 = require("../models");
const errors_1 = require("../errors");
const valid_object_id_1 = require("../helpers/valid-object-id");
const helpers_1 = require("../helpers");
exports.isInGroup = async (req, res, next) => {
    try {
        const { params, body, userId, newToken } = req;
        const { group } = body;
        const { id } = params;
        const idGroup = group || id;
        if (!valid_object_id_1.validObjectId(idGroup)) {
            return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Grupo'), newToken));
        }
        if (!await models_1.Groups.findOne({ _id: idGroup, creator: userId })) {
            if (!await models_1.Groups.findOne({ _id: idGroup, administrator: userId })) {
                if (!await models_1.Groups.findOne({ _id: idGroup, members: userId })) {
                    return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Grupo'), newToken));
                }
            }
        }
        next();
    }
    catch (error) {
        return res.status(500).json(errors_1.serverError());
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
exports.isMember = async (req, res, next) => {
    try {
        const { params, userId, newToken } = req;
        if (!params.id) {
            return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Id'), newToken));
        }
        if (!await models_1.Groups.findOne({ _id: params.id, members: userId })) {
            return res.status(401).json('Acesso negado');
        }
        return next();
    }
    catch (error) {
        return res.status(500).json(errors_1.serverError());
    }
};
exports.isAdmin = async (req, res, next) => {
    try {
        const { params, userId, newToken } = req;
        if (!params.id) {
            return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Id'), newToken));
        }
        if (!await models_1.Groups.findOne({ _id: params.id, administrators: userId })) {
            return res.status(401).json('Acesso negado');
        }
        return next();
    }
    catch (error) {
        return res.status(500).json(errors_1.serverError());
    }
};
exports.isCreator = async (req, res, next) => {
    try {
        const { params, userId, newToken } = req;
        if (!params.id) {
            return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Id'), newToken));
        }
        if (!await models_1.Groups.findOne({ _id: params.id, creator: userId })) {
            return res.status(401).json('Acesso negado');
        }
        return next();
    }
    catch (error) {
        return res.status(500).json(errors_1.serverError());
    }
};
exports.isCreatorOrAdmin = async (req, res, next) => {
    try {
        const { params, userId, newToken } = req;
        const { id } = params;
        if (!params.id) {
            return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Id'), newToken));
        }
        if (!await models_1.Groups.findOne({ _id: id, creator: userId })) {
            if (!await models_1.Groups.findOne({ _id: id, administrators: userId })) {
                return res.status(401).json('Acesso negado');
            }
        }
        return next();
    }
    catch (error) {
        return res.status(500).json(errors_1.serverError());
    }
};

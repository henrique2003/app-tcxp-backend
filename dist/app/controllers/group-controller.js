"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../../utils");
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
const valid_object_id_1 = require("../helpers/valid-object-id");
class GroupsController {
    async index(req, res) {
        try {
            const { page = 1 } = req.query;
            const options = {
                perPage: page,
                populate: 'creator administrators members',
                limit: 10
            };
            const groups = await models_1.Groups.paginate({}, options);
            return res.status(200).json(helpers_1.responseWithToken(groups));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async mine(req, res) {
        try {
            const { userId, newToken } = req;
            const creatorGroup = await models_1.Groups.find({ creator: userId });
            const adminGroup = await models_1.Groups.find({ administrators: userId });
            const memberGroup = await models_1.Groups.find({ members: userId });
            const groups = { creatorGroup, adminGroup, memberGroup };
            return res.status(200).json(helpers_1.responseWithToken(groups, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async store(req, res) {
        try {
            const { body, userId, newToken } = req;
            req.body = utils_1.cleanFields(body);
            const requiredFields = ['title', 'description'];
            if (!utils_1.isValidFields(requiredFields, body)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError(), newToken));
            }
            if (await models_1.Groups.findOne({ title: body.title })) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.fieldInUse('Nome do grupo'), newToken));
            }
            body.creator = await models_1.User.findById(userId);
            const group = await models_1.Groups.create(body);
            return res.status(200).json(helpers_1.responseWithToken(group, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async show(req, res) {
        try {
            const group = await models_1.Groups.findById(req.params.id).populate('creator administrators members');
            if (!group)
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Grupo')));
            return res.status(200).json(helpers_1.responseWithToken(group));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async inviteRequest(req, res) {
        try {
            const { body, newToken, userId } = req;
            const { from, group } = body;
            req.body = utils_1.cleanFields(body);
            const requiredFields = ['from', 'group'];
            if (!utils_1.isValidFields(requiredFields, body)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError(), newToken));
            }
            // Valid object id from
            if (!valid_object_id_1.validObjectId(from)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            const isFrom = await models_1.User.findById(from);
            if (!isFrom) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            const isGroup = await models_1.Groups.findById(group);
            if (!isGroup) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            // Pick user to
            const userTo = await models_1.User.findById(userId);
            // if repeat invite
            for (const invite of userTo.inviteRequest) {
                if (invite.from == from && invite.group == group) {
                    return res.status(400).json(helpers_1.responseWithToken('Convite já existe', newToken));
                }
            }
            const invite = {
                from: isFrom,
                group: isGroup
            };
            userTo.inviteRequest.push(invite);
            await userTo.save();
            const inviteRes = await models_1.User.findById(userId).populate('inviteRequest.from inviteRequest.group');
            // Pick user from
            const userFrom = await models_1.User.findById(from);
            const request = {
                to: userTo,
                group: isGroup
            };
            userFrom.acceptRequest.push(request);
            await userFrom.save();
            return res.status(200).json(helpers_1.responseWithToken(inviteRes, newToken));
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json(errors_1.serverError());
        }
    }
    async acceptRequest(req, res) {
        var _a, _b, _c, _d;
        try {
            const { body, newToken, userId } = req;
            const { to, group } = body;
            req.body = utils_1.cleanFields(body);
            const requiredFields = ['to', 'group'];
            if (!utils_1.isValidFields(requiredFields, body)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError(), newToken));
            }
            // Valid object id
            if (!valid_object_id_1.validObjectId(to)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            const isTo = await models_1.User.findById(to);
            if (!isTo) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            const isGroup = await models_1.Groups.findById(group);
            if (!isGroup) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            // Pick user to valid if accept request exist
            const user = await models_1.User.findById(userId);
            if (!await models_1.User.findOne({ _id: userId, 'acceptRequest.to': to, 'acceptRequest.group': group })) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            // Pick To to valid if invite request exist
            if (!await models_1.User.findOne({ _id: to, 'inviteRequest.from': userId, 'inviteRequest.group': group })) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Convite'), newToken));
            }
            // add member by the group
            if (await models_1.Groups.findOne({ members: userId })) {
                return res.status(400).json(helpers_1.responseWithToken('Usuário ja esta no grupo', newToken));
            }
            isGroup.members.push(user);
            await isGroup.save();
            // remove inviteRequest
            (_a = isTo === null || isTo === void 0 ? void 0 : isTo.inviteRequest) === null || _a === void 0 ? void 0 : _a.splice((_b = isTo === null || isTo === void 0 ? void 0 : isTo.inviteRequest) === null || _b === void 0 ? void 0 : _b.map(invite => invite.from && invite.group).indexOf(user === null || user === void 0 ? void 0 : user._id, isGroup._id));
            await isTo.save();
            // remove acceptRequest
            (_c = user === null || user === void 0 ? void 0 : user.acceptRequest) === null || _c === void 0 ? void 0 : _c.splice((_d = user === null || user === void 0 ? void 0 : user.acceptRequest) === null || _d === void 0 ? void 0 : _d.map(accept => accept.to && accept.group).indexOf(to, isGroup._id));
            await (user === null || user === void 0 ? void 0 : user.save());
            return res.status(200).json(helpers_1.responseWithToken(null, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async update(req, res) {
        const { body, newToken, file, params } = req;
        const { title, description } = body;
        const { id } = params;
        try {
            req.body = utils_1.cleanFields(body);
            const lastGroup = await models_1.Groups.findById(id);
            if (!lastGroup) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Grupo'), newToken));
            }
            if (title) {
                if (!await models_1.Groups.findOne({ title })) {
                    return res.status(400).json(helpers_1.responseWithToken(errors_1.fieldInUse('Titulo'), newToken));
                }
            }
            lastGroup.title = title;
            if (description)
                lastGroup.description = description;
            if (file) {
                // Delete last image if exists
                if (lastGroup.image) {
                    helpers_1.awsS3DeleteImage(lastGroup.image.key);
                }
                if (file.originalname)
                    lastGroup.image.name = file.originalname.toString();
                if (file.size)
                    lastGroup.image.size = file.size;
                if (file.key)
                    lastGroup.image.key = file.key;
                if (file.location)
                    lastGroup.image.url = file.location;
            }
            const group = await models_1.Groups.findByIdAndUpdate({
                _id: id
            }, {
                $set: lastGroup
            }, {
                upsert: true
            });
            if (group) {
                if (title)
                    group.title = title;
                if (description)
                    group.description = description;
                if (file) {
                    group.image.name = file.originalname;
                    group.image.size = file.size;
                    group.image.key = file.key;
                    group.image.url = file.location;
                }
            }
            return res.status(200).json(helpers_1.responseWithToken(group, newToken));
        }
        catch (error) {
            if (file) {
                helpers_1.awsS3DeleteImage(file.key);
            }
            return res.status(500).json(errors_1.serverError());
        }
    }
    async logoutGroup(req, res) {
        var _a, _b, _c, _d;
        try {
            const { params, userId, newToken } = req;
            const { id } = params;
            const group = await models_1.Groups.findById(id);
            if (!group) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Grupo'), newToken));
            }
            if (typeof group.members === 'object') {
                (_a = group === null || group === void 0 ? void 0 : group.members) === null || _a === void 0 ? void 0 : _a.splice((_b = group === null || group === void 0 ? void 0 : group.members) === null || _b === void 0 ? void 0 : _b.map(member => member._id).indexOf(userId));
            }
            if (typeof group.administrators === 'object') {
                (_c = group === null || group === void 0 ? void 0 : group.administrators) === null || _c === void 0 ? void 0 : _c.splice((_d = group === null || group === void 0 ? void 0 : group.administrators) === null || _d === void 0 ? void 0 : _d.map(member => member._id).indexOf(userId));
            }
            await (group === null || group === void 0 ? void 0 : group.save());
            return res.status(200).json(helpers_1.responseWithToken('Saiu do grupo com sucesso', newToken));
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json(errors_1.serverError());
        }
    }
    async removeParticipantGroup(req, res) {
        var _a, _b, _c, _d;
        try {
            const { params, newToken, body } = req;
            const { id } = params;
            const { idParticipant } = body;
            const group = await models_1.Groups.findById(id);
            if (!group) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Grupo'), newToken));
            }
            if (typeof group.members === 'object') {
                (_a = group === null || group === void 0 ? void 0 : group.members) === null || _a === void 0 ? void 0 : _a.splice((_b = group === null || group === void 0 ? void 0 : group.members) === null || _b === void 0 ? void 0 : _b.map(member => member._id).indexOf(idParticipant));
            }
            if (typeof group.administrators === 'object') {
                (_c = group === null || group === void 0 ? void 0 : group.administrators) === null || _c === void 0 ? void 0 : _c.splice((_d = group === null || group === void 0 ? void 0 : group.administrators) === null || _d === void 0 ? void 0 : _d.map(member => member._id).indexOf(idParticipant));
            }
            await (group === null || group === void 0 ? void 0 : group.save());
            return res.status(200).json(helpers_1.responseWithToken('Removido do grupo com sucesso', newToken));
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json(errors_1.serverError());
        }
    }
    async destroy(req, res) {
        try {
            const { params, newToken } = req;
            const { id } = params;
            if (!id) {
                res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Id'), newToken));
            }
            const usersAccepts = await models_1.User.find({ 'acceptRequest.group': id });
            const idGroup = id;
            if (usersAccepts) {
                usersAccepts.map(async (user) => {
                    var _a, _b;
                    (_a = user === null || user === void 0 ? void 0 : user.acceptRequest) === null || _a === void 0 ? void 0 : _a.splice((_b = user === null || user === void 0 ? void 0 : user.acceptRequest) === null || _b === void 0 ? void 0 : _b.map(accept => accept.group).indexOf(idGroup));
                    await models_1.User.findByIdAndUpdate({
                        _id: user.id
                    }, {
                        $set: user
                    }, {
                        upsert: true
                    });
                });
            }
            const usersRequests = await models_1.User.find({ 'inviteRequest.group': id });
            if (usersRequests) {
                usersRequests.map(async (user) => {
                    var _a, _b;
                    (_a = user === null || user === void 0 ? void 0 : user.inviteRequest) === null || _a === void 0 ? void 0 : _a.splice((_b = user === null || user === void 0 ? void 0 : user.inviteRequest) === null || _b === void 0 ? void 0 : _b.map(request => request.group).indexOf(idGroup));
                    await models_1.User.findByIdAndUpdate({
                        _id: user.id
                    }, {
                        $set: user
                    }, {
                        upsert: true
                    });
                });
            }
            await models_1.Groups.findByIdAndDelete(id);
            return res.status(200).json(helpers_1.responseWithToken(errors_1.deleteSuccess(), newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async storeMessage(req, res) {
        var _a;
        try {
            const { body, params, newToken, userId } = req;
            const { id } = params;
            const { message } = body;
            req.body = utils_1.cleanFields(body);
            if (!message) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Mensagem'), newToken));
            }
            const group = await models_1.Groups.findById(id);
            const newMessage = {
                user: userId,
                content: message
            };
            group.messages.push(newMessage);
            const resGroup = await models_1.Groups.findByIdAndUpdate({
                _id: id
            }, {
                $set: group
            }, {
                upsert: true
            });
            if (resGroup) {
                (_a = resGroup.messages) === null || _a === void 0 ? void 0 : _a.push(newMessage);
            }
            return res.status(200).json(helpers_1.responseWithToken(resGroup, newToken));
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json(errors_1.serverError());
        }
    }
    async moveToAdmin(req, res) {
        var _a, _b, _c, _d;
        try {
            const { body, params, newToken } = req;
            const { id } = params;
            const { idMember } = body;
            req.body = utils_1.cleanFields(body);
            if (!idMember) {
                return res.status(401).json(helpers_1.responseWithToken(errors_1.notFound('Id do usuário'), newToken));
            }
            const group = await models_1.Groups.findById(id);
            if (!group) {
                return res.status(401).json(helpers_1.responseWithToken('Você não pode realizar está ação', newToken));
            }
            if (!await models_1.Groups.findOne({ _id: id, members: idMember })) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Membro'), newToken));
            }
            if (await models_1.Groups.findOne({ _id: id, administrators: idMember })) {
                return res.status(400).json(helpers_1.responseWithToken('Usuário ja é um admin', newToken));
            }
            if (typeof group.members === 'object') {
                (_a = group === null || group === void 0 ? void 0 : group.members) === null || _a === void 0 ? void 0 : _a.splice((_b = group === null || group === void 0 ? void 0 : group.members) === null || _b === void 0 ? void 0 : _b.map(message => message._id).indexOf(idMember));
            }
            await group.save();
            const reqGroup = await models_1.Groups.findById(id);
            (_c = reqGroup.administrators) === null || _c === void 0 ? void 0 : _c.push(idMember);
            const resGroup = await models_1.Groups.findByIdAndUpdate({
                _id: id
            }, {
                $set: reqGroup
            }, {
                upsert: true
            });
            if (resGroup) {
                (_d = resGroup.administrators) === null || _d === void 0 ? void 0 : _d.push(idMember);
            }
            return res.status(200).json(helpers_1.responseWithToken(resGroup, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
}
exports.default = new GroupsController();

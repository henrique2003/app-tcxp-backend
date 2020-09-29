"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const validator_1 = __importDefault(require("validator"));
const models_1 = require("../models");
const utils_1 = require("../../utils");
const helpers_1 = require("../helpers");
const errors_1 = require("../errors");
class UserController {
    async index(req, res) {
        try {
            const { page = 1 } = req.query;
            const options = {
                perPage: page,
                limit: 10
            };
            const user = await models_1.User.paginate({}, options);
            return res.status(200).json(helpers_1.responseWithToken(user));
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json(errors_1.serverError());
        }
    }
    async store(req, res) {
        try {
            const { body } = req;
            const { password, email, name, passwordConfirmation } = body;
            // Clean fields
            req.body = utils_1.cleanFields(body);
            // Verify if fields exists
            const requiredFields = ['name', 'password', 'passwordConfirmation', 'email'];
            if (!utils_1.isValidFields(requiredFields, body)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError()));
            }
            // Valid passwordConfirmation
            if (password !== passwordConfirmation) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidFieldError('confirmar email')));
            }
            // Valid if is a email
            if (!validator_1.default.isEmail(email)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidFieldError('email')));
            }
            // Valid id email alredy in use
            if (await models_1.User.findOne({ email })) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.fieldInUse('email')));
            }
            // Put the first letter of name in capital ans encrip password
            const hashPassword = await bcrypt_1.hash(password, 10);
            req.body = Object.assign(body, { name: utils_1.titleize(name), password: hashPassword });
            // Email confirmation
            const expires = new Date();
            req.body.emailConfirmationCode = crypto_1.randomBytes(10).toString('hex');
            req.body.emailConfirmationExpire = expires.setHours(expires.getHours() + 1);
            // Create new user
            const user = await models_1.User.create(body);
            // Invite email
            if (!await helpers_1.emailConfirmation(user)) {
                return res.status(500).json(helpers_1.responseWithToken(errors_1.inviteEmailError('confirmação')));
            }
            // Generate a new token
            const token = helpers_1.generateToken(user.id);
            return res.status(200).json(helpers_1.responseWithToken(user, token));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async update(req, res) {
        const { body, userId, newToken, file } = req;
        const { password, passwordConfirmation, email, rememberMe, interestings } = body;
        try {
            req.body = utils_1.cleanFields(body);
            const lastUser = await models_1.User.findById(userId);
            if (!lastUser) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Usuário'), newToken));
            }
            if (email) {
                // Valid if is a email
                if (!validator_1.default.isEmail(email)) {
                    return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidFieldError('email'), newToken));
                }
                // Valid id email alredy in use
                if (await models_1.User.findOne({ email })) {
                    return res.status(400).json(helpers_1.responseWithToken(errors_1.fieldInUse('email'), newToken));
                }
            }
            const validFields = [
                'name',
                'email',
                'city',
                'state',
                'country',
                'celphone',
                'facebook',
                'instagram',
                'twitter'
            ];
            const fieldsUser = lastUser;
            const { imageProfile } = fieldsUser;
            for (const field of validFields) {
                if (field)
                    fieldsUser[field] = body[field];
            }
            // Valid passwordConfirmation
            if (password) {
                if (password !== passwordConfirmation) {
                    return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidFieldError('confirmar senha'), newToken));
                }
                else {
                    lastUser.password = await bcrypt_1.hash(password, 10);
                }
            }
            // Interestings
            if (interestings) {
                let newInterestings = interestings.split(',');
                newInterestings = newInterestings.map(interesting => {
                    return interesting.trim();
                });
                fieldsUser.interestings = newInterestings;
            }
            if (rememberMe)
                fieldsUser.rememberMe = true;
            else
                fieldsUser.rememberMe = false;
            // Upload image
            if (file) {
                const { key, originalname, size, location } = file;
                // Delete last image if exists
                if (imageProfile) {
                    helpers_1.awsS3DeleteImage(imageProfile.key);
                }
                if (originalname)
                    imageProfile.name = originalname;
                if (size)
                    imageProfile.size = size;
                if (key)
                    imageProfile.key = key;
                if (location)
                    imageProfile.url = location;
            }
            const user = await models_1.User.findByIdAndUpdate({
                _id: userId
            }, {
                $set: fieldsUser
            }, {
                upsert: true
            });
            if (user) {
                if (fieldsUser.name)
                    user.name = fieldsUser.name;
                if (fieldsUser.email)
                    user.email = fieldsUser.email;
                if (fieldsUser.city)
                    user.city = fieldsUser.city;
                if (fieldsUser.state)
                    user.state = fieldsUser.state;
                if (fieldsUser.country)
                    user.country = fieldsUser.country;
                if (fieldsUser.celphone)
                    user.celphone = fieldsUser.celphone;
                if (fieldsUser.facebook)
                    user.facebook = fieldsUser.facebook;
                if (fieldsUser.instagram)
                    user.instagram = fieldsUser.instagram;
                if (fieldsUser.twitter)
                    user.twitter = fieldsUser.twitter;
                if (file) {
                    user.imageProfile.size = fieldsUser.imageProfile.size;
                    user.imageProfile.name = fieldsUser.imageProfile.originalname;
                    user.imageProfile.key = fieldsUser.imageProfile.key;
                    user.imageProfile.url = fieldsUser.imageProfile.url;
                }
            }
            return res.status(200).json(helpers_1.responseWithToken(user, newToken));
        }
        catch (error) {
            if (file) {
                helpers_1.awsS3DeleteImage(file.key);
            }
            console.log(error.message);
            return res.status(500).json(errors_1.serverError());
        }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('id')));
            const user = await models_1.User.findById(id);
            if (!user)
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Usuário')));
            return res.status(200).json(helpers_1.responseWithToken(user));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async destroy(req, res) {
        try {
            const id = req.userId;
            const user = await models_1.User.findById(id);
            if (user === null || user === void 0 ? void 0 : user.imageProfile) {
                helpers_1.awsS3DeleteImage(user.imageProfile.key);
            }
            await models_1.User.findByIdAndDelete(id);
            return res.status(200).json(helpers_1.responseWithToken(errors_1.deleteSuccess()));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async emailConfirmation(req, res) {
        try {
            const { userId: id, newToken } = req;
            const user = await models_1.User.findById(id).select('+emailConfirmationExpire emailConfirmationCode');
            if (!user) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Usuário'), newToken));
            }
            const { emailConfirmationExpire, emailConfirmationCode } = user;
            const now = new Date();
            if (now > emailConfirmationExpire) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.expiresCode(), newToken));
            }
            if (req.body.emailConfirmationCode !== emailConfirmationCode) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidCode(), newToken));
            }
            user.emailConfirmation = true;
            await user.save();
            const resUser = await models_1.User.findById(id);
            return res.status(200).json(helpers_1.responseWithToken(resUser, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async emailConfirmationResend(req, res) {
        try {
            const { userId, newToken } = req;
            const id = userId;
            const user = await models_1.User.findById(id);
            if (!user) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Usuário'), newToken));
            }
            // Put the first letter of name in capital ans encrip password
            user.emailConfirmationCode = crypto_1.randomBytes(10).toString('hex');
            const expires = new Date();
            user.emailConfirmationExpire = expires.setHours(expires.getHours() + 1);
            // Invite email
            if (!helpers_1.emailConfirmation(user)) {
                return res.status(500).json(helpers_1.responseWithToken(errors_1.inviteEmailError('confirmação'), newToken));
            }
            await user.save();
            return res.status(200).json(helpers_1.responseWithToken('Email reenviado com sucesso', newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await models_1.User.findOne({ email });
            if (!user) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Usuário')));
            }
            const expires = new Date();
            user.forgotPasswordExpire = expires.setHours(expires.getHours() + 1);
            user.forgotPasswordToken = crypto_1.randomBytes(20).toString('hex');
            await user.save();
            // Invite email
            helpers_1.forgotPassword(user);
            return res.status(200).json(helpers_1.responseWithToken('Um email foi enviado para você!'));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async forgotPasswordConfirm(req, res) {
        try {
            const { token, password, passwordConfirmation } = req.body;
            const user = await models_1.User.findOne({ forgotPasswordToken: token }).select('+forgotPasswordExpire forgotPasswordToken');
            if (!user) {
                return res.status(404).json(helpers_1.responseWithToken(errors_1.notFound('Token de autenticação')));
            }
            const { forgotPasswordToken, forgotPasswordExpire } = user;
            const now = new Date();
            if (now > forgotPasswordExpire) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.expiresCode()));
            }
            if (token !== forgotPasswordToken) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidCode()));
            }
            if (!password) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.missingParamError('senha')));
            }
            if (password !== passwordConfirmation) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.invalidFieldError('confirmar senha')));
            }
            user.password = await bcrypt_1.hash(password, 10);
            user.forgotPasswordToken = null;
            const resUser = await models_1.User.findByIdAndUpdate({
                _id: user.id
            }, {
                $set: user
            }, {
                upsert: true
            });
            return res.status(200).json(helpers_1.responseWithToken(resUser));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
    async avaliate(req, res) {
        try {
            const { body, newToken, userId, params } = req;
            const { avaliate } = body;
            const { id } = params;
            if (!id || !helpers_1.validObjectId(id)) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('Id'), newToken));
            }
            const user = await models_1.User.findById(id);
            if (!user) {
                return res.status(400).json(helpers_1.responseWithToken(errors_1.notFound('User'), newToken));
            }
            if (user._id == userId) {
                return res.status(401).json(helpers_1.responseWithToken('Você não pode se auto avaliar', newToken));
            }
            let ifRepeatAvaliate = false;
            if ((user === null || user === void 0 ? void 0 : user.avaliate.length) !== 0) {
                user === null || user === void 0 ? void 0 : user.avaliate.map((avaliate) => {
                    if (avaliate.user == userId) {
                        ifRepeatAvaliate = true;
                    }
                });
            }
            if (ifRepeatAvaliate) {
                return res.status(400).json(helpers_1.responseWithToken('Você ja avaliou está pessoa', newToken));
            }
            user === null || user === void 0 ? void 0 : user.avaliate.push({
                user: userId,
                avaliate
            });
            let avaliations = 0;
            for (const avaliation of user === null || user === void 0 ? void 0 : user.avaliate) {
                avaliations = avaliations + avaliation.avaliate;
            }
            if (user.avaliate.length !== 0) {
                user.totalAvaliate = avaliations / user.avaliate.length;
            }
            if (user)
                await user.save();
            const resUser = await models_1.User.findById(id);
            return res.status(200).json(helpers_1.responseWithToken(resUser, newToken));
        }
        catch (error) {
            return res.status(500).json(errors_1.serverError());
        }
    }
}
exports.default = new UserController();

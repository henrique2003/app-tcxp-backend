"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const ts_mongoose_pagination_1 = require("ts-mongoose-pagination");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true
    },
    country: String,
    state: String,
    city: String,
    celphone: String,
    facebook: String,
    twitter: String,
    instagram: String,
    imageProfile: {
        name: String,
        size: Number,
        key: String,
        url: String
    },
    avaliate: [{
            user: {
                type: 'ObjectId',
                ref: 'User'
            },
            avaliate: Number
        }],
    totalAvaliate: Number,
    rememberMe: {
        type: Boolean,
        default: false
    },
    interestings: [String],
    inviteRequest: [{
            from: {
                type: 'ObjectId',
                ref: 'User'
            },
            group: {
                type: 'ObjectId',
                ref: 'Groups'
            }
        }],
    acceptRequest: [{
            to: {
                type: 'ObjectId',
                ref: 'User'
            },
            group: {
                type: 'ObjectId',
                ref: 'Groups'
            }
        }],
    emailConfirmation: {
        type: Boolean,
        default: false
    },
    emailConfirmationExpire: {
        type: Date,
        select: false
    },
    emailConfirmationCode: {
        type: String,
        required: true,
        select: false
    },
    forgotPasswordExpire: {
        type: Date,
        select: false
    },
    forgotPasswordToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});
UserSchema.plugin(ts_mongoose_pagination_1.mongoosePagination);
exports.User = mongoose_1.model('User', UserSchema);

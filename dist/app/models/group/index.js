"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ts_mongoose_pagination_1 = require("ts-mongoose-pagination");
const GroupsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        name: String,
        size: Number,
        key: String,
        url: String
    },
    creator: {
        type: 'ObjectId',
        ref: 'User'
    },
    administrators: [{
            type: 'ObjectId',
            ref: 'User'
        }],
    members: [{
            type: 'ObjectId',
            ref: 'User'
        }],
    messages: [{
            user: {
                type: 'ObjectId',
                ref: 'User'
            },
            content: {
                type: String
            }
        }]
}, {
    timestamps: true
});
GroupsSchema.plugin(ts_mongoose_pagination_1.mongoosePagination);
exports.Groups = mongoose_1.model('Groups', GroupsSchema);

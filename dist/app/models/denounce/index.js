"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Denounce = void 0;
const mongoose_1 = require("mongoose");
const ts_mongoose_pagination_1 = require("ts-mongoose-pagination");
const denounceSchema = new mongoose_1.Schema({
    to: {
        type: 'ObjectId',
        ref: 'User'
    },
    from: {
        type: 'ObjectId',
        ref: 'User'
    },
    denounce: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});
denounceSchema.plugin(ts_mongoose_pagination_1.mongoosePagination);
exports.Denounce = mongoose_1.model('Denounce', denounceSchema);

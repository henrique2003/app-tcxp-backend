"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFields = void 0;
exports.cleanFields = (objectFields) => {
    for (const field of Object.keys(objectFields)) {
        if (typeof objectFields[field] === 'string') {
            objectFields[field] = objectFields[field].trim();
        }
    }
    return objectFields;
};

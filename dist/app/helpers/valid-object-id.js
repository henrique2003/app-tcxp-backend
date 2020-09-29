"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validObjectId = (objectId) => {
    if (objectId.length !== 24) {
        return false;
    }
    return true;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidFields(requireFields, fields) {
    for (const field of requireFields) {
        if (!fields[field])
            return false;
    }
    return true;
}
exports.isValidFields = isValidFields;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseWithToken = (body, token = '') => {
    return token ? { body, token } : { body };
};

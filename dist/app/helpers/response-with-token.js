"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseWithToken = void 0;
exports.responseWithToken = (body, token = '') => {
    return token ? { body, token } : { body };
};

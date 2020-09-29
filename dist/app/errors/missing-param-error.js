"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingParamError = void 0;
exports.missingParamError = (fields = '') => {
    return fields ? `Campo ${fields} inválido` : 'Campo inválido';
};

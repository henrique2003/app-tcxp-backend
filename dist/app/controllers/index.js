"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = exports.AuthController = exports.UserController = void 0;
const user_controller_1 = __importDefault(require("./user-controller"));
exports.UserController = user_controller_1.default;
const auth_controller_1 = __importDefault(require("./auth-controller"));
exports.AuthController = auth_controller_1.default;
const group_controller_1 = __importDefault(require("./group-controller"));
exports.GroupController = group_controller_1.default;

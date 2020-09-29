"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const routes = express_1.Router();
// Login
routes.post('/login', controllers_1.AuthController.login);
// Load user
routes.get('/load', middlewares_1.auth, controllers_1.AuthController.loadUser);
exports.default = routes;

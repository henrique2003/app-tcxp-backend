"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const denounce_controller_1 = __importDefault(require("../controllers/denounce-controller"));
const middlewares_1 = require("../middlewares");
const router = express_1.Router();
// Register a new denounce
router.post('/denounce/:id', middlewares_1.auth, middlewares_1.emailConfirmation, denounce_controller_1.default.store);
// Show all denounces
router.get('/denounce', middlewares_1.auth, denounce_controller_1.default.index);
exports.default = router;

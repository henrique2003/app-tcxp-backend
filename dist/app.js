"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const routes_1 = require("./app/routes");
const db_1 = __importDefault(require("./config/db"));
dotenv_1.config();
class App {
    constructor() {
        db_1.default.connectDb();
        this.express = express_1.default();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.express.use(cors_1.default({ origin: process.env.ACCESS_URL }));
        this.express.use(helmet_1.default());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use(morgan_1.default('dev'));
        this.express.use(express_1.default.json());
    }
    routes() {
        this.express.use('/api', routes_1.User);
        this.express.use('/api', routes_1.Auth);
        this.express.use('/api', routes_1.Group);
        this.express.use('/api', routes_1.Denounce);
    }
}
exports.default = new App().express;

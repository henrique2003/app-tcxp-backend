"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
dotenv_1.config();
class Db {
    async connectDb() {
        var _a;
        try {
            await mongoose_1.connect((_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : '', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });
            console.log('MongoDb Connected...');
        }
        catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }
}
exports.default = new Db();

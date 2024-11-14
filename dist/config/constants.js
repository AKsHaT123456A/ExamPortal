"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
// Loading environment variables
const constants = {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGODB_URI: process.env.MONGODB_URI,
    email: process.env.email,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    pass: process.env.pass,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    TEST_EMAIL: process.env.TEST_EMAIL,
    USER_ID: process.env.USER_ID,
    PROMETHEUSER: process.env.PROMETHEUSER,
    PROMETHEPASS: process.env.PROMETHEPASS,
    REDIS_URL: process.env.REDIS_URL,
};
exports.default = constants;

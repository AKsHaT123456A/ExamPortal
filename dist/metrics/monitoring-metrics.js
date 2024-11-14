"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoring = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const basic_auth_1 = __importDefault(require("basic-auth"));
const constants_1 = __importDefault(require("../config/constants"));
const console_1 = require("console");
const monitoring = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, basic_auth_1.default)(req);
    (0, console_1.log)(constants_1.default.PROMETHEUSER);
    if (!user || user.name !== constants_1.default.PROMETHEUSER || user.pass !== constants_1.default.PROMETHEPASS) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Metrics"');
        return res.end('Access denied');
    }
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(yield prom_client_1.default.register.metrics());
});
exports.monitoring = monitoring;

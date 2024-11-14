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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_utils_1 = require("../utils/jwt-utils");
const custom_error_1 = require("../error/custom-error");
const authenticate = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        throw new custom_error_1.CustomError("Authorization token missing", 401);
    }
    const userClaims = yield (0, jwt_utils_1.verifyJWT)(token);
    if (!userClaims) {
        throw new custom_error_1.CustomError("Invalid or expired token", 401);
    }
    req.user = userClaims;
    next();
});
exports.authenticate = authenticate;

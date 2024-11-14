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
exports.verifyJWT = exports.generateJWT = void 0;
const jose_1 = require("jose");
const generateJWT = (claims) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.JWT_SECRET || "secret";
    const jwt = yield new jose_1.SignJWT(claims)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(new TextEncoder().encode(secret));
    return jwt;
});
exports.generateJWT = generateJWT;
const verifyJWT = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.JWT_SECRET || "secret";
    try {
        const { payload } = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(secret));
        return payload;
    }
    catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
});
exports.verifyJWT = verifyJWT;

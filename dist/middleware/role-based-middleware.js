"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const custom_error_1 = require("../error/custom-error");
const authorize = (requiredRole) => {
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            throw new custom_error_1.CustomError("User not authenticated", 401);
        }
        if (user.role !== requiredRole) {
            throw new custom_error_1.CustomError("Forbidden: You do not have the required role", 403);
        }
        next();
    };
};
exports.authorize = authorize;

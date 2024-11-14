"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
const app_error_1 = require("./app-error");
class InternalError extends app_error_1.CustomError {
    constructor(message) {
        super(message, 500);
        this.name = this.constructor.name;
    }
}
exports.InternalError = InternalError;

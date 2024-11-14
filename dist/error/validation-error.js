"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const app_error_1 = require("./app-error");
class ValidationError extends app_error_1.CustomError {
    constructor(message) {
        super(message, 400);
        this.name = this.constructor.name;
    }
}
exports.ValidationError = ValidationError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statuscode) {
        super(message);
        this.name = this.constructor.name;
        this.stack = (new Error()).stack;
        this.statusCode = statuscode ? statuscode : 500;
        this.isOperational = true;
    }
}
exports.CustomError = CustomError;

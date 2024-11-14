"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const responseSchema = new mongoose_1.Schema({
    ansStatus: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    ansId: { type: String, index: true },
    userId: { type: String, index: true },
    quesId: { type: String, index: true },
    category: { type: String },
}, { versionKey: false });
const questionResponse = (0, mongoose_1.model)("questionResponse", responseSchema);
exports.default = questionResponse;

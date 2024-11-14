"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    category: {
        type: String,
        trim: true,
        indexedDB: true,
        required: true,
    },
    options: [
        {
            name: {
                type: String,
                trim: true,
                required: [true, "Please add option field"],
            },
            ansId: {
                type: String,
                trim: true,
                required: [true, "Please add ansId field"],
            },
        }
    ],
    quesId: {
        type: String,
        trim: true,
        required: true,
    },
    correctId: {
        type: String,
        trim: true,
        required: true,
    },
    count: {
        type: Number,
        default: 0
    }
}, { versionKey: false });
const Question = (0, mongoose_1.model)("Question", questionSchema);
exports.default = Question;

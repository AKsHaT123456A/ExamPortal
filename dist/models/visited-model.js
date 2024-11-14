"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const visitedSchema = new mongoose_1.Schema({
    userId: { type: String, index: true },
    quesId: { type: String, index: true },
    category: { type: String },
}, { versionKey: false });
const Visited = (0, mongoose_1.model)("visited", visitedSchema);
exports.default = Visited;

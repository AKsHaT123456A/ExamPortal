"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    studentNo: { type: String, unique: true, required: true },
    responses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "questionResponse",
            default: [],
        }],
    password: { type: String, required: true },
    logintime: { type: Number, default: 0 },
    isRelogin: { type: Boolean, default: false },
    isSubmit: { type: Boolean, default: false },
    category: { type: String },
}, { versionKey: false, timestamps: true });
userSchema.virtual('calculatedTotalScore').get(function () {
    return this.responses.reduce((total, response) => total + (response.score || 0), 0);
});
const User_Test = (0, mongoose_1.model)("User_Test", userSchema);
exports.default = User_Test;

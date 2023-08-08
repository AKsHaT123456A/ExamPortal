const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: { type: String, index: true }, // Adding index to 'email' field
        gender: { type: String },
        isHosteler: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        name: { type: String, trim: true },
        mobileNo: { type: Number, default: 0, index: true },
        studentNo: { type: Number, index: true }, // Adding index to 'studentNo' field
        branch: { type: String },
        responses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "questionResponse",
            default: [],
        }],
        password: { type: String, default: "" },
        totalScore: { type: Number, default: 0 },
        counts: {
            markedUnanswered: { type: Number, default: 0 },
            unanswered: { type: Number, default: 0 },
            markedCorrect: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            markedWrong: { type: Number, default: 0 },
            wrong: { type: Number, default: 0 },
        },
    },
    { versionKey: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User; 

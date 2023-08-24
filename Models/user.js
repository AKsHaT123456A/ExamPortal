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
        logintime: {
            type: Number,
            default: 0
        },
        category:{ type: String, default:"C++"}
    },
    { versionKey: false }
);

userSchema.virtual('calculatedTotalScore').get(function () {
    return this.responses.reduce((total, response) => total + response.score, 0);
});


const User = mongoose.model("User", userSchema);
module.exports = User; 

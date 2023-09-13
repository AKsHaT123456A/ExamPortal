const mongoose = require("mongoose");
const userValidationSchema = require("../validators/userValidationSchema");

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        gender: { type: String, enum: ['Female', 'Male'] },
        isHosteler: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        name: { type: String, trim: true, required: true },
        mobileNo: { type: String, unique: true, required: true },
        studentNo: { type: String, unique: true, required: true },
        branch: { type: String, enum: ['IT', 'CSE', 'CSE-AIML', 'AIML', 'CS', 'EN', 'ECE', 'ME', 'CSE-DS', 'CSIT', 'CE',"CSE-HINDI"] },
        responses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "questionResponse",
            default: [],
        }],
        password: { type: String, required: true },
        logintime: { type: Number, default: 0 },
        isRelogin: { type: Boolean, default: false },
        isSubmit: { type: Boolean, default: false },
        category: { type: String },
    },
    { versionKey: false }
);

userSchema.virtual('calculatedTotalScore').get(function () {
    return this.responses.reduce((total, response) => total + response.score, 0);
});

const validateUser = (user) => {
    try {
        return userValidationSchema.validateAsync(user);
    }
    catch (err) {
        return err;
    }
};

const User = mongoose.model("User", userSchema);
module.exports = { User, validateUser };

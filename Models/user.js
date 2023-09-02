const mongoose = require("mongoose");
const userValidationSchema = require("../validators/userValidationSchema");

const userSchema = new mongoose.Schema(
    {
        email: { type: String, index: true }, // Adding index to 'email' field
        gender: { type: String,enum:['FEMALE','MALE'] },
        isHosteler: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        name: { type: String, trim: true },
        mobileNo: { type: Number, default: 0, index: true },
        studentNo: { type: Number, index: true }, // Adding index to 'studentNo' field
        branch: { type: String, enum: ['IT', 'CSE', 'CSEAIML','AIML','CS','EN','ECE','MECHANICAL','CSEDS','CSIT','CIVIL'] },
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
        isRelogin: { type: Boolean, default: false },
        isSubmit: { type: Boolean, default: false },
        category: { type: String, default: "C++" },
    },
    { versionKey: false }
);

userSchema.virtual('calculatedTotalScore').get(function () {
    return this.responses.reduce((total, response) => total + response.score, 0);
});

const validateUser = (user) => {
    return userValidationSchema.validateAsync(user);
  };
  
const User = mongoose.model("User", userSchema);
module.exports = {User,validateUser}; 

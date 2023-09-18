const mongoose = require("mongoose");
const userValidationSchema = require("../validators/userValidationSchema");

const daySchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        gender: { type: String, enum: ['Female', 'Male'] },
        isHosteler: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        name: { type: String, trim: true, required: true },
        mobileNo: { type: String, unique: true, required: true },
        studentNo: { type: String, unique: true, required: true },
        branch: { type: String, enum: ['IT', 'CSE', 'CSE-AIML', 'AIML', 'CS', 'EN', 'ECE', 'ME', 'CSE-DS', 'CSIT', 'CE',"CSE-HINDI"] },
    },
    { versionKey: false }
);

daySchema.virtual('calculatedTotalScore').get(function () {
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

const day2 = mongoose.model("day2", daySchema);
module.exports = { day2, validateUser };

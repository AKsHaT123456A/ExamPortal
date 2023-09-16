const mongoose = require("mongoose");

const manageSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        gender: { type: String, enum: ['Female', 'Male'] },
        isHosteler: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        name: { type: String, trim: true, required: true },
        mobileNo: { type: String, unique: true, required: true },
        studentNo: { type: String, unique: true, required: true },
        branch: {
            type: String,
            enum: ['IT', 'CSE', 'CSE-AIML', 'AIML', 'CS', 'EN', 'ECE', 'ME', 'CSE-DS', 'CSIT', 'CE',"CSE-HINDI"]
        },
    },
    { versionKey: false }
);
const manage = mongoose.model("manage", manageSchema);
module.exports = manage;

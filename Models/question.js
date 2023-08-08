const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    options: [
        {
            type: String,
            trim: true,
            required: [true, "Please add option field"],
        },
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
    ansId: [
        {
            type: String,
            trim: true,
            required: true
        }
    ],
    count: {
        type: Number,
        default: 0
    }
});

const question = mongoose.model("question", questionSchema);
module.exports = question;

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

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

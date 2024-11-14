import { Schema, model } from "mongoose";


const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    category: {
        type: String,
        trim: true,
        indexedDB: true,
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

const Question = model("Question", questionSchema);
export default Question;

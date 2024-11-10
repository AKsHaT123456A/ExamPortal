import { Schema, model } from "mongoose";
const responseSchema = new Schema({
    ansStatus: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    ansId: { type: String, index: true },
    userId: { type: String, index: true },
    quesId: { type: String, index: true },
    category: { type: String },
}, { versionKey: false });


const questionResponse = model("questionResponse", responseSchema);
export default questionResponse;

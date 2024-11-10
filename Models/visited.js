import { Schema, model } from "mongoose";
const visitedSchema = new Schema({
    userId: { type: String, index: true },
    quesId: { type: String, index: true},
    category: { type: String },
}, { versionKey: false });


const visted = model("visited", visitedSchema);
export default visted;

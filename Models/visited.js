const mongoose = require("mongoose");
const visitedSchema = new mongoose.Schema({
    userId: { type: String, index: true },
    quesId: { type: String, index: true ,unique:true},
    category: { type: String },
    isVisited: { type: Boolean, default: false }
}, { versionKey: false });


const visted = mongoose.model("visited", visitedSchema);
module.exports = visted;

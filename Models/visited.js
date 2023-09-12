const mongoose = require("mongoose");
const visitedSchema = new mongoose.Schema({
    userId: { type: String, index: true },
    quesId: { type: String, index: true ,unique:true},
    category: { type: String },
}, { versionKey: false });


const visted = mongoose.model("visited", visitedSchema);
module.exports = visted;

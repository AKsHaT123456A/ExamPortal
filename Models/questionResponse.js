const mongoose = require("mongoose");
const responseSchema = new mongoose.Schema({
    ansStatus: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    ansId:{type:String,index:true},
    quesId: { type: String, index: true }, 
}, { versionKey: false });


const questionResponse = mongoose.model("questionResponse", responseSchema);
module.exports = questionResponse;

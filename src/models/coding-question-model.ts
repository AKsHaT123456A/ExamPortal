import { Schema, model } from "mongoose";

// Define the schema for a coding question
const codingQuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true, 
    },
    constraints: {
      type: String,
      required: true, 
    },
    examples: {
      type: [String],
      required: true,    },
    quesId: {
      type: String,
      trim: true,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },

  },
  { versionKey: false } 
);

// Create the model for coding questions
const CodingQuestion = model("CodingQuestion", codingQuestionSchema);

export default CodingQuestion;

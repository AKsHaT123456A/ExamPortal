"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// QuestionService.ts
const custom_error_1 = require("../error/custom-error");
const question_model_1 = __importDefault(require("../models/question-model")); // Import your Question Mongoose model
class QuestionService {
    constructor() { } // Private constructor for singleton
    static getInstance() {
        if (!QuestionService.instance) {
            QuestionService.instance = new QuestionService();
        }
        return QuestionService.instance;
    }
    // Method to add a question
    addQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newQuestion = new question_model_1.default(data);
                const savedQuestion = yield newQuestion.save();
                return savedQuestion.toObject();
            }
            catch (error) {
                throw new custom_error_1.CustomError("Failed to add question", 500);
            }
        });
    }
    // Method to get all questions
    getQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield question_model_1.default.find();
                return questions.map((question) => {
                    const questionObj = question.toObject();
                    return Object.assign(Object.assign({}, questionObj), { ansId: questionObj.correctId // Assuming ansId should be the same as correctId
                     });
                });
            }
            catch (error) {
                throw new custom_error_1.CustomError("Failed to fetch questions", 500);
            }
        });
    }
    // Method to delete a question by ID
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield question_model_1.default.findByIdAndDelete(questionId);
            }
            catch (error) {
                throw new custom_error_1.CustomError("Failed to delete question", 500);
            }
        });
    }
    // Method to update a question by ID
    updateQuestion(questionId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedQuestion = yield question_model_1.default.findByIdAndUpdate(questionId, updateData, { new: true });
                if (!updatedQuestion)
                    throw new custom_error_1.CustomError("Question not found", 404);
                return updatedQuestion.toObject();
            }
            catch (error) {
                throw new custom_error_1.CustomError("Failed to update question", 500);
            }
        });
    }
    // Method to get questions by category
    getCategoryQuestions(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield question_model_1.default.find({ category });
                return questions.map((question) => {
                    const questionObj = question.toObject();
                    return Object.assign(Object.assign({}, questionObj), { ansId: questionObj.correctId // Assuming ansId should be the same as correctId
                     });
                });
            }
            catch (error) {
                throw new custom_error_1.CustomError("Failed to fetch questions by category", 500);
            }
        });
    }
    // Method to count questions by category
    countQuestionsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield question_model_1.default.countDocuments({ category });
                return count;
            }
            catch (error) {
                throw new custom_error_1.CustomError("Failed to count questions by category", 500);
            }
        });
    }
}
exports.default = QuestionService.getInstance();

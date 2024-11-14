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
exports.countQuestionsByCategory = exports.getCategoryQuestions = exports.updateQuestion = exports.deleteQuestion = exports.getQuestions = exports.addQuestion = void 0;
const question_service_1 = __importDefault(require("../services/question-service"));
const redis_cache_1 = require("../cache/redis-cache");
const constants_1 = __importDefault(require("../config/constants"));
const addQuestion = (
//@ts-ignore
req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionData = req.body;
        const addedQuestion = yield question_service_1.default.addQuestion(questionData);
        return res.status(201).json({
            success: true,
            msg: addedQuestion,
        });
    }
    catch (error) {
        //@ts-ignore
        return res.status(error.status || 500).json({
            //@ts-ignore
            error: { message: error.message || "Internal Server Error" },
        });
    }
});
exports.addQuestion = addQuestion;
// Controller method to get all questions
const getQuestions = (
//@ts-ignore
_req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    const redisCache = redis_cache_1.RedisCache.getInstance(constants_1.default.REDIS_URL);
    try {
        const questions = yield question_service_1.default.getQuestions();
        const cachedQuestion = yield redisCache.getQuestions();
        if (cachedQuestion) {
            return res.status(200).json({
                success: true,
                msg: JSON.parse(cachedQuestion),
            });
        }
        yield redisCache.setQuestions(questions);
        return res.status(200).json({
            success: true,
            msg: questions,
        });
    }
    catch (error) {
        //@ts-ignore
        return res.status(error.status || 500).json({
            //@ts-ignore
            error: { message: error.message || "Internal Server Error" },
        });
    }
});
exports.getQuestions = getQuestions;
// Controller method to delete a question by ID
const deleteQuestion = (
//@ts-ignore
req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.id;
        yield question_service_1.default.deleteQuestion(questionId);
        return res.status(204).json({
            msg: "Question has been deleted",
        });
    }
    catch (error) {
        //@ts-ignore
        return res.status(error.status || 500).json({
            //@ts-ignore
            error: { message: error.message || "Internal Server Error" },
        });
    }
});
exports.deleteQuestion = deleteQuestion;
// Controller method to update a question by ID
const updateQuestion = (
//@ts-ignore
req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.id;
        const updateData = req.body;
        const updatedQuestion = yield question_service_1.default.updateQuestion(questionId, updateData);
        return res.status(200).json({
            success: true,
            msg: updatedQuestion,
        });
    }
    catch (error) {
        //@ts-ignore
        return res.status(error.status || 500).json({
            //@ts-ignore
            error: { message: error.message || "Internal Server Error" },
        });
    }
});
exports.updateQuestion = updateQuestion;
// Controller method to get questions by category
const getCategoryQuestions = (
//@ts-ignore
req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.params.key;
        const categoryQuestions = yield question_service_1.default.getCategoryQuestions(category);
        return res.status(200).json({
            success: true,
            msg: categoryQuestions,
        });
    }
    catch (error) {
        //@ts-ignore
        return res.status(error.status || 500).json({
            //@ts-ignore
            error: { message: error.message || "Internal Server Error" },
        });
    }
});
exports.getCategoryQuestions = getCategoryQuestions;
// Controller method to count questions by category
const countQuestionsByCategory = (
//@ts-ignore
req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.query.category;
        const questionCount = yield question_service_1.default.countQuestionsByCategory(category);
        return res.status(200).json({
            success: true,
            msg: { count: questionCount },
        });
    }
    catch (error) {
        //@ts-ignore
        return res.status(error.status || 500).json({
            //@ts-ignore
            error: { message: error.message || "Internal Server Error" },
        });
    }
});
exports.countQuestionsByCategory = countQuestionsByCategory;

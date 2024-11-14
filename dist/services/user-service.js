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
const question_response_model_1 = __importDefault(require("../models/question-response-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const userResponseSend = (
//@ts-ignore
req, 
//@ts-ignore
res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const user = yield user_model_1.default.findOne({ studentNo: id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const questionPromises = user.responses.map((response) => __awaiter(void 0, void 0, void 0, function* () {
            const question = yield question_response_model_1.default.findById(response);
            return question;
        }));
        const questions = yield Promise.all(questionPromises);
        return res.status(200).json({ questions });
    }
    catch (error) {
        return res
            .status(500)
            //@ts-ignore
            .json({ error: "Internal Server Error", message: err.message });
    }
});
exports.default = userResponseSend;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("../controllers/question-controller");
const router = express_1.default.Router();
router.post("/addquestions", question_controller_1.addQuestion);
router.get("/getquestions", question_controller_1.getQuestions);
router.delete("/deletequestions/:id", question_controller_1.deleteQuestion);
router.patch("/updatequestion/:id", question_controller_1.updateQuestion);
router.get("/category/:key", question_controller_1.getCategoryQuestions);
router.get("/counts", question_controller_1.countQuestionsByCategory);
exports.default = router;

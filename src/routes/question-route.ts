import express from 'express';
import { addQuestion, countQuestionsByCategory, deleteQuestion, getCategoryQuestions, getQuestions, updateQuestion } from '../controllers/question-controller';
const router = express.Router();

router.post("/addquestions", addQuestion);
router.get("/getquestions", getQuestions);
router.delete("/deletequestions/:id", deleteQuestion);
router.patch("/updatequestion/:id", updateQuestion);
router.get("/category/:key", getCategoryQuestions);
router.get("/counts", countQuestionsByCategory);


export default router;

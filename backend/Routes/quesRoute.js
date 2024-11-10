import express from "express";
const router = express.Router();
import { addquestions, getquestions, deletequestion, updatequestion, categoryquestion, countQuestion } from "../Controllers/questionController.js";

router.post("/addquestions", addquestions);
router.get("/getquestions", getquestions);
router.delete("/deletequestions/:id", deletequestion);
router.patch("/updatequestion/:id", updatequestion);
router.get("/category/:key", categoryquestion);
router.get("/counts", countQuestion);

export default router;

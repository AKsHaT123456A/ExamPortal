// QuestionController.ts
import { Request, Response } from "express";
import QuestionService from "../services/question-service";
import {
  AddCodingQuestionResponse,
  AddQuestionRequest,
  AddQuestionResponse,
  CategoryCodingQuestionsResponse,
  CategoryQuestionsResponse,
} from "../types/question-type-service";
import { RedisCache } from "../cache/redis-cache";
import constants from "../config/constants";

export const addQuestion = async (
  //@ts-ignore
  req,
  //@ts-ignore
  res
) => {
  try {
    const questionData: AddQuestionRequest = req.body;
    const addedQuestion: AddQuestionResponse|AddCodingQuestionResponse =
      await QuestionService.addQuestion(questionData);

    return res.status(201).json({
      success: true,
      msg: addedQuestion,
    });
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return res.status(error.status || 500).json({
      //@ts-ignore
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

// Controller method to get all questions
export const getQuestions = async (
  //@ts-ignore
  _req,
  //@ts-ignore
  res
) => {
  const redisCache = RedisCache.getInstance(constants.REDIS_URL);
  try {
    const questions: AddQuestionResponse[] =
      await QuestionService.getQuestions();
    const cachedQuestion = await redisCache.getQuestions();
    if (cachedQuestion) {
      return res.status(200).json({
        success: true,
        msg: JSON.parse(cachedQuestion),
      });
    }
    await redisCache.setQuestions(questions);
    return res.status(200).json({
      success: true,
      msg: questions,
    });
  } catch (error) {
    //@ts-ignore
    return res.status(error.status || 500).json({
      //@ts-ignore
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

// Controller method to delete a question by ID
export const deleteQuestion = async (
  //@ts-ignore
  req,
  //@ts-ignore
  res
) => {
  try {
    const questionId: string = req.params.id;

    await QuestionService.deleteQuestion(questionId);

    return res.status(204).json({
      msg: "Question has been deleted",
    });
  } catch (error) {
    //@ts-ignore
    return res.status(error.status || 500).json({
      //@ts-ignore
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

// Controller method to update a question by ID
export const updateQuestion = async (
  //@ts-ignore
  req,
  //@ts-ignore
  res
) => {
  try {
    const questionId: string = req.params.id;
    const updateData: Partial<AddQuestionRequest> = req.body;

    const updatedQuestion: AddQuestionResponse|AddCodingQuestionResponse =
      await QuestionService.updateQuestion(questionId, updateData);

    return res.status(200).json({
      success: true,
      msg: updatedQuestion,
    });
  } catch (error) {
    //@ts-ignore
    return res.status(error.status || 500).json({
      //@ts-ignore
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

// Controller method to get questions by category
export const getCategoryQuestions = async (
  //@ts-ignore
  req,
  //@ts-ignore
  res
) => {
  try {
    const category: string = req.params.key;

    const categoryQuestions: CategoryQuestionsResponse[] |CategoryCodingQuestionsResponse[]=
      await QuestionService.getCategoryQuestions(category);

    return res.status(200).json({
      success: true,
      msg: categoryQuestions,
    });
  } catch (error) {
    //@ts-ignore
    return res.status(error.status || 500).json({
      //@ts-ignore
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

// Controller method to count questions by category
export const countQuestionsByCategory = async (
  //@ts-ignore
  req,
  //@ts-ignore
  res
) => {
  try {
    const category: string = req.query.category as string;

    const questionCount: number =
      await QuestionService.countQuestionsByCategory(category);

    return res.status(200).json({
      success: true,
      msg: { count: questionCount },
    });
  } catch (error) {
    //@ts-ignore
    return res.status(error.status || 500).json({
      //@ts-ignore
      error: { message: error.message || "Internal Server Error" },
    });
  }
};

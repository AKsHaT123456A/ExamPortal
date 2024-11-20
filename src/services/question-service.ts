// QuestionService.ts
import { CustomError } from "../error/custom-error";
import CodingQuestion from "../models/coding-question-model";
import Question  from "../models/question-model"; // Import your Question Mongoose model
import {
  AddCodingQuestionResponse,
  AddQuestionRequest,
  AddQuestionResponse,
  CategoryCodingQuestionsResponse,
  CategoryQuestionsResponse,
} from "../types/question-type-service";


class QuestionService {
  private static instance: QuestionService;

  private constructor() {} // Private constructor for singleton

  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  // Method to add a question
  public async addQuestion(data: AddQuestionRequest): Promise<AddQuestionResponse|AddCodingQuestionResponse> {
    try {
      const newQuestion = data.category==="Coding"?new CodingQuestion(data):new Question(data);
      const savedQuestion = await newQuestion.save();
      return savedQuestion.toObject();
    } catch (error) {
      throw new CustomError("Failed to add question", 500);
    }
  }

  // Method to get all questions
  public async getQuestions(): Promise<AddQuestionResponse[]> {
    try {
      const questions = await Question.find();
      return questions.map((question) => {
        const questionObj = question.toObject();
        return {
          ...questionObj,
          ansId: questionObj.correctId 
        };
      });
    } catch (error) {
      throw new CustomError("Failed to fetch questions", 500);
    }
  }

  // Method to delete a question by ID
  public async deleteQuestion(questionId: string): Promise<void> {
    try {
      await Question.findByIdAndDelete(questionId);
    } catch (error) {
      throw new CustomError("Failed to delete question", 500);
    }
  }

  // Method to update a question by ID
  public async updateQuestion(
    questionId: string,
    updateData: Partial<AddQuestionRequest>
  ): Promise<AddQuestionResponse> {
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        updateData,
        { new: true }
      );
      if (!updatedQuestion) throw new CustomError("Question not found", 404);
      return updatedQuestion.toObject();
    } catch (error) {
      throw new CustomError("Failed to update question", 500);
    }
  }

  // Method to get questions by category
  public async getCategoryQuestions(
    category: string
  ): Promise<CategoryQuestionsResponse[] | CategoryCodingQuestionsResponse[]> {
    try {
      const questions = category === "Coding" ? await CodingQuestion.find() : await Question.find({ category });
      return questions.map((question: any) => {
        const questionObj = question.toObject();
        return {
          ...questionObj,
          ansId: questionObj.correctId // Assuming ansId should be the same as correctId
        };
      });
    } catch (error: any) {
      throw new CustomError("Failed to fetch questions by category", 500);
    }
  }

  // Method to count questions by category
  public async countQuestionsByCategory(category: string): Promise<number> {
    try {
      const count = await Question.countDocuments({ category });
      return count;
    } catch (error) {
      throw new CustomError("Failed to count questions by category", 500);
    }
  }
}

export default QuestionService.getInstance();

export interface AddQuestionRequest {
  quesId: string;
  question: string;
  options: string[];
  category: string;
  ansId: string;
  correctId: string;
}

export interface QuestionData extends AddQuestionRequest {
  count?: number;
}

export interface AddQuestionResponse {
  quesId: string;
  question: string;
  options: {
    ansId: string;
    name: string;
  }[];
  category: string;
  count: number;
}

export interface CategoryQuestionsResponse extends AddQuestionResponse {
  ansId: string;
}

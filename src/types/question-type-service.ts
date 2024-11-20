// Regular Question Types
export interface AddQuestionRequest {
  quesId: string;
  question: string;
  options: string[];  // Only for multiple choice questions
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

// Coding Question Types
export interface AddCodingQuestionRequest {
  quesId: string;
  question: string;
  description: string;
  constraints: string;
  examples: string[];
  category: string;
  correctId?: string; // Optional, could be the ID of the correct solution or reference
}

export interface CodingQuestionData extends AddCodingQuestionRequest {
  count?: number;
}

export interface AddCodingQuestionResponse {
  quesId: string;
  question: string;
  description: string;
  constraints: string;
  examples: string[];
  category: string;
  count: number;
}

export interface CategoryCodingQuestionsResponse extends AddCodingQuestionResponse {
  correctId?: string;
}

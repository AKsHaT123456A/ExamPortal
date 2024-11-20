export interface ICoding {
  getQuestion(quesId: string, userId: string): Promise<any>;

  submitCode(code: string, quesId: string, userId: string): Promise<any>;

  runCode(code: string, quesId: string, userId: string): Promise<any>;
}

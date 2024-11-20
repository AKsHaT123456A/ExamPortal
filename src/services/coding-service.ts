import { ICoding} from "../interfaces/i-coding-interface"

export class CodingService implements ICoding {
  public async getQuestion(quesId: string, userId: string): Promise<any> {
    console.log(`Fetching question ${quesId} for user ${userId}`);
    return {
      quesId,
      userId,
      question: "Write a function that returns the sum of two numbers",
      tests: [
        {
          input: "1, 2",
          output: "3",
        },
        {
          input: "4, 5",
          output: "9",
        },
      ],
    };
  }

  public async submitCode(code: string, quesId: string, userId: string): Promise<any> {
    console.log(`Submitting code for question ${quesId} by user ${userId}`);
    return {
      quesId,
      userId,
      code,
      result: "Accepted",
    };
  }

  public async runCode(code: string, quesId: string, userId: string): Promise<any> {
    console.log(`Running code for question ${quesId} by user ${userId}`);
    return {
      quesId,
      userId,
      code,
      result: "Accepted",
    };
  }
}
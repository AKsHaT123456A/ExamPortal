
export class CustomError extends Error {
    public isOperational: boolean;
    public statusCode: number;
  
    constructor(message: string,statuscode: number) {
      super(message);
      this.name = this.constructor.name;
      this.stack = (new Error()).stack;
      this.statusCode = statuscode?statuscode:500;
      this.isOperational = true; 
    }
  }
  
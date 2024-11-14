export class CustomError extends Error {
    public statusCode: number;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.isOperational = true;
      this.stack = (new Error()).stack; 
    }
  }

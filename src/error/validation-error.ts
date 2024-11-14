import { CustomError } from "./app-error";

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = this.constructor.name;
  }
}

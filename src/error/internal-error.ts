import { CustomError } from "./app-error";

export class InternalError extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = this.constructor.name;
  }
}

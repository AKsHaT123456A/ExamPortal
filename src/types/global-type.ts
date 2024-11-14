import { UserClaims } from "./user-type";

export {};

declare global {
    namespace Express {
      interface Request {
        user?: UserClaims;
      }
    }
  }
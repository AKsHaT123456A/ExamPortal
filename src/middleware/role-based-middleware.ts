import { Request, Response, NextFunction } from "express";
import { CustomError } from "../error/custom-error";
import { UserClaims } from "../types/user-type";

export const authorize = (requiredRole: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user: UserClaims = req.user as UserClaims;

    if (!user) {
      throw new CustomError("User not authenticated", 401);
    }

    if (user.role !== requiredRole) {
      throw new CustomError(
        "Forbidden: You do not have the required role",
        403
      );
    }
    next();
  };
};

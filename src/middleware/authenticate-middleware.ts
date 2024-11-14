import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt-utils";
import { CustomError } from "../error/custom-error";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new CustomError("Authorization token missing", 401);
  }

  const userClaims = await verifyJWT(token);

  if (!userClaims) {
    throw new CustomError("Invalid or expired token", 401);
  }
  req.user = userClaims;
  next();
};

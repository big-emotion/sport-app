import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";

export interface JwtPayload {
  id: string;
  email: string;
  roles: string[];
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      next(new UnauthorizedError("No token provided"));
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token"));
  }
};

import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  const token = cookieToken || bearerToken;

  if (token) {
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }

  next();
};

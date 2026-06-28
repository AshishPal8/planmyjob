import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const cookieToken = req.cookies?.token;

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  // Prefer cookie token, fallback to bearer token
  const token = cookieToken || bearerToken;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  req.user = payload;
  next();
};

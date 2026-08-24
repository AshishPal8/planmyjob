import jwt from "jsonwebtoken";
import type { Response } from "express";
import { envConfig } from "../config/env.config";

export interface TokenPayload {
  id: number;
  email: string;
  role?: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, envConfig.jwt.secret, {
    expiresIn: "30d",
  });
}


export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, envConfig.jwt.secret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain:
      process.env.NODE_ENV === "production"
        ? envConfig.cookieDomain
        : "localhost",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain:
      process.env.NODE_ENV === "production"
        ? envConfig.cookieDomain
        : "localhost",
    path: "/",
  });
}

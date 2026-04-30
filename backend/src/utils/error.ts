import type { Request, Response, NextFunction } from "express";

// -------------------- Base AppError --------------------
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// -------------------- Manual Error Thrower --------------------
export const errorHandler = (statusCode: number, message: string): AppError => {
  return new AppError(statusCode, message);
};

// -------------------- Global Error Handler --------------------
export const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(
    "🔴 [ERROR HANDLER] Called — headersSent:",
    res.headersSent,
    "url:",
    req.url,
  );

  if (res.headersSent) {
    console.log("🔴 [ERROR HANDLER] SKIPPED — headers already sent");
    return;
  }
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Something went wrong";

  console.error({
    name: err.name,
    message: err.message,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    statusCode,
    message,
  });
};

// -------------------- Helper Specific Errors --------------------
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

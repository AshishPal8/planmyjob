import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

export const validateRequest = (
  schema: z.ZodTypeAny,
  target: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[target];
    const parsed = schema.safeParse(dataToValidate);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten().fieldErrors,
        message: "Validation Failed",
      });
      return;
    }

    if (target === "body") req.body = parsed.data;
    if (target === "query") req.query = parsed.data as any;
    if (target === "params") req.params = parsed.data as any;

    next();
  };
};



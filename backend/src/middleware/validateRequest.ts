import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten().fieldErrors,
        message: "Validation Failed",
      });
      return;
    }

    req.body = parsed.data;
    next();
  };
};

import type { NextFunction, Request, Response } from "express";

export const requstLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timeStamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers["user-agent"] || "Unknown";
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  console.log(
    `[${timeStamp}] ${method} ${url} -IP: ${ip} -Device: ${userAgent}`,
  );

  res.on("finish", () => {
    console.log("🔵 [LOGGER] Response finished:", res.statusCode, url);
  });

  res.on("close", () => {
    console.log("🟡 [LOGGER] Response closed:", res.statusCode);
  });

  next();
};

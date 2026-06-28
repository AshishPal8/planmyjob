import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const isProd = process.env.NODE_ENV === "production";

const rateLimitResponse = (message: string) => ({
  handler: (_req: any, res: any) => {
    res.status(429).json({ success: false, message });
  },
});

// global — all routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many requests, please slow down."),
});

// auth routes — tight to block OAuth abuse / token stuffing
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many auth attempts, try again later."),
});

// file upload — expensive operation
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProd ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Upload limit reached, try again in an hour."),
});

// match API — heavy DB query
export const matchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 30 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many search requests, slow down."),
});

// search suggestions — lightweight but spammable
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 60 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many search requests."),
});

// apply click — prevent click farming
export const applyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many apply attempts."),
});

// progressive slow-down: after 50 requests add 300ms delay per extra req (cap 5s)
export const globalSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: isProd ? 50 : 500,
  delayMs: (used, req) => {
    const delay = (used - (req as any).slowDown.limit) * 300;
    return Math.min(delay, 5000);
  },
});

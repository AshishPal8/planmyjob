import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const isProd = process.env.NODE_ENV === "production";

const rateLimitResponse = (message: string) => ({
  handler: (_req: any, res: any) => {
    res.status(429).json({ success: false, message });
  },
});

// 1. Global Limiter — platform-wide safety ceiling per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many requests from this IP. Please try again later."),
});

// 2. Global Progressive Slow-Down — gradually adds delay after 50 reqs (cap 3s)
export const globalSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: isProd ? 50 : 300,
  delayMs: (used, req) => {
    const delay = (used - (req as any).slowDown.limit) * 100;
    return Math.min(delay, 3000);
  },
});

// 3. Daily Resume Parsing Limiter — strictly 10 requests per 24 hours per IP
export const resumeParseDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours (1 day)
  max: isProd ? 10 : 30, // 10 per day in production (30 in dev/testing)
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse(
    "Daily resume parsing limit (10 per day) reached. Please try again tomorrow.",
  ),
});

// 4. Resume Burst Protection Limiter — prevents rapid concurrent uploads (max 3 per 5 mins)
export const resumeParseBurstLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: isProd ? 3 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse(
    "Too many rapid resume uploads. Please wait a few minutes before trying again.",
  ),
});

// 5. Authenticated File Upload Limiter — image & general files (max 20 per 15 mins)
export const fileUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("File upload limit reached. Please wait a few minutes."),
});

// 6. Gemini Match / Job Search API Limiter — heavy DB + AI queries (max 20 per min)
export const matchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isProd ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many job match requests. Please slow down."),
});

// 7. Search Suggestions Limiter — lightweight search queries (max 40 per min)
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isProd ? 40 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many search requests. Please wait a moment."),
});

// 8. Auth Limiter — prevents credential stuffing / OAuth spam (max 20 per 15 mins)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many authentication attempts. Please try again later."),
});

// 9. Job Apply Click Limiter — prevents bot click farming (max 10 per min)
export const applyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isProd ? 10 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Too many apply attempts. Please slow down."),
});

// 10. Admin API Limiter — protects administrative routes against automated abuse
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  ...rateLimitResponse("Admin rate limit exceeded. Please slow down."),
});

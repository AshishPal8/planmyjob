import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import { connectDB } from "./db/connect";
import { globalErrorHandler } from "./utils/error";
import cookieParser from "cookie-parser";
import { envConfig } from "./config/env.config";
import {
  globalLimiter,
  globalSlowDown,
  authLimiter,
  matchLimiter,
  searchLimiter,
  applyLimiter,
  adminLimiter,
} from "./middleware/rateLimiter";

import authRoutes from "./modules/auth/auth.route";
import uploadRoutes from "./modules/upload/upload.route";
import jobsRoutes from "./modules/jobs/jobs.route";
import userRoutes from "./modules/user/user.route";
import searchRoutes from "./modules/search/search.route";
import adminRoutes from "./modules/admin/admin.route";

dotenv.config();

const app = express();
const PORT = envConfig.port || 4000;

// Security: Hide Express fingerprint
app.disable("x-powered-by");

// Trust proxy: exactly 1 hop (Nginx / ALB) for accurate client IP in rate limiting
app.set("trust proxy", 1);

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: envConfig.frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Body size cap — tightened to 500kb to prevent memory bloat DoS
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));

// HTTP Parameter Pollution protection
app.use(hpp());

app.use(cookieParser());

// Global safety ceiling & progressive slow-down per IP
app.use(globalSlowDown);
app.use(globalLimiter);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// Per-route security & rate limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/upload", uploadRoutes); // Route-level daily & burst limiters inside
app.use("/api/jobs/match", matchLimiter);
app.use("/api/jobs/apply", applyLimiter);
app.use("/api/jobs", jobsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", searchLimiter, searchRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);

// Global Error Handler
app.use(globalErrorHandler);

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();

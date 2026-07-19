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
  uploadLimiter,
  matchLimiter,
  searchLimiter,
  applyLimiter,
} from "./middleware/rateLimiter";

import authRoutes from "./modules/auth/auth.route";
import uploadRoutes from "./modules/upload/upload.route";
import jobsRoutes from "./modules/jobs/jobs.route";
import userRoutes from "./modules/user/user.route";
import searchRoutes from "./modules/search/search.route";

import { startAllCrons } from "./cron";

dotenv.config();

const app = express();
const PORT = envConfig.port || 4000;

// security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: envConfig.frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// body size cap — prevent large payload attacks
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// HTTP parameter pollution prevention
app.use(hpp());

app.use(cookieParser());

// global rate limit + slow down on all routes
app.use(globalSlowDown);
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ success: true });
});

// Routes — per-route limiters applied before the router
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/upload", uploadLimiter, uploadRoutes);
app.use("/api/jobs/match", matchLimiter);
app.use("/api/jobs/apply", applyLimiter);
app.use("/api/jobs", jobsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", searchLimiter, searchRoutes);

// Global Error Handler
app.use(globalErrorHandler);

(async () => {
  await connectDB();

  startAllCrons();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();

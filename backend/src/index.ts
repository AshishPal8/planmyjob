import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connect";
import { globalErrorHandler } from "./utils/error";
import cookieParser from "cookie-parser";
import { envConfig } from "./config/env.config";

import authRoutes from "./modules/auth/auth.route";
import uploadRoutes from "./modules/upload/upload.route";

dotenv.config();

const app = express();
const PORT = envConfig.port || 4000;

app.use(
  cors({
    origin: envConfig.frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ success: true });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Global Error Handler
app.use(globalErrorHandler);

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();

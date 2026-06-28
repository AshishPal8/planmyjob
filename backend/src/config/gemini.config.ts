import { GoogleGenerativeAI } from "@google/generative-ai";
import { envConfig } from "./env.config";

export const gemini = new GoogleGenerativeAI(envConfig.google.geminiApiKey);
export const geminiModel = gemini.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
});

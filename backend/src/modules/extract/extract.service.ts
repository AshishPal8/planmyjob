import { gemini } from "../../config/gemini.config";
import { extractedResumeSchema, type ExtractedResume } from "./extract.schema";

const MODELS = [
  // "gemini-2.5-flash",
  // "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite-preview-09-2025",
];

const RESUME_PROMPT = `
You are a resume parser. Extract information from this resume PDF and return ONLY a JSON object.
No explanation, no markdown, no backticks — raw JSON only.

Return this exact shape:
{
  "name": string,
  "email": string,
  "phone": string,
  "currentTitle": string,
  "experienceYears": number,
  "education": string,
  "summary": string (2-3 sentence professional summary),
  "skills": string[] (technical skills only, no soft skills)
}

If a field is missing, use null. skills must always be an array.
`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const extractResumeData = async (
  pdfBuffer: Buffer,
): Promise<ExtractedResume> => {
  let lastError: Error | null = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);

      const model = gemini.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBuffer.toString("base64"),
          },
        },
        RESUME_PROMPT,
      ]);

      console.log({ result });

      const text = result.response.text().trim();
      const clean = text
        .replace(/^```json\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
      const parsed = JSON.parse(clean);

      console.log({ parsed });

      console.log(`✅ Extracted with model: ${modelName}`);
      return extractedResumeSchema.parse(parsed);
    } catch (error: any) {
      lastError = error;

      /**
       * Retry on these — temporary issues worth trying next model for.
       * 404 means model name wrong/unavailable — also try next.
       * Throw immediately only on auth errors (bad API key).
       */
      const shouldRetry =
        error?.message?.includes("503") ||
        error?.message?.includes("404") ||
        error?.message?.includes("Service Unavailable") ||
        error?.message?.includes("high demand") ||
        error?.message?.includes("not found");

      const isAuthError =
        error?.message?.includes("400") ||
        error?.message?.includes("API_KEY") ||
        error?.message?.includes("PERMISSION_DENIED");

      if (isAuthError) {
        throw error; // no point retrying — bad key
      }

      if (shouldRetry) {
        console.warn(
          `Model ${modelName} failed (${error?.message?.slice(0, 60)}), trying next...`,
        );
        await sleep(1000);
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("All Gemini models failed");
};

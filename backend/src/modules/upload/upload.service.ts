import { resumes, type Resume } from "../../db/schema";
import { extractResumeData } from "../extract/extract.service";
import { imagekitInstance } from "../../config/imagekit.config";
import { db } from "../../db";
import { eq, sql } from "drizzle-orm";

export const uploadAndProcessResume = async (
  file: Express.Multer.File,
): Promise<Resume> => {
  const [ikResult, extractedData] = await Promise.all([
    imagekitInstance.upload({
      file: file.buffer,
      fileName: `resume_${Date.now()}.pdf`,
      folder: "/resumes",
      useUniqueFileName: true,
    }),
    extractResumeData(file.buffer),
  ]);

  const inserted = await db
    .insert(resumes)
    .values({
      fileUrl: ikResult.url,
      fileId: ikResult.fileId,
      originalName: file.originalname,
      extractedName: extractedData.name,
      extractedEmail: extractedData.email,
      extractedPhone: extractedData.phone,
      currentTitle: extractedData.currentTitle,
      experienceYears: extractedData.experienceYears,
      education: extractedData.education,
      summary: extractedData.summary,
      skills: extractedData.skills ?? [],
      extractedData: extractedData,
      isProcessed: true,
    })
    .returning();

  return inserted[0]!;
};

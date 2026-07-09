import { resumes, type Resume } from "../../db/schema";
import { extractResumeData } from "../extract/extract.service";
import { imagekitInstance } from "../../config/imagekit.config";
import { db } from "../../db";
import sharp from "sharp";

const IMAGE_MIMETYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const uploadFileService = async (file: Express.Multer.File) => {
  const isImage = IMAGE_MIMETYPES.includes(file.mimetype);

  let buffer = file.buffer;
  let fileName: string;
  let folder: string;

  if (isImage) {
    buffer = await sharp(file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    fileName = `img_${Date.now()}.webp`;
    folder = "/planmyjob/images";
  } else {
    fileName = `file_${Date.now()}_${file.originalname}`;
    folder = "/planmyjob/resumes";
  }

  const result = await imagekitInstance.upload({
    file: buffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return { url: result.url, fileId: result.fileId };
};

export const uploadAndProcessResume = async (
  file: Express.Multer.File,
): Promise<Resume> => {
  const [ikResult, extractedData] = await Promise.all([
    imagekitInstance.upload({
      file: file.buffer,
      fileName: `resume_${Date.now()}.pdf`,
      folder: "/planmyjob/resumes",
      useUniqueFileName: true,
    }),
    // Never let a parsing failure (bad AI response, all models down, etc.)
    // lose the uploaded file — fall back to an unprocessed row instead.
    extractResumeData(file.buffer).catch((error) => {
      console.error("Resume extraction failed, saving file without parsed data:", error);
      return null;
    }),
  ]);

  const inserted = await db
    .insert(resumes)
    .values({
      fileUrl: ikResult.url,
      fileId: ikResult.fileId,
      originalName: file.originalname,
      extractedName: extractedData?.name,
      extractedEmail: extractedData?.email,
      extractedPhone: extractedData?.phone,
      currentTitle: extractedData?.currentTitle,
      experienceYears: extractedData?.experienceYears,
      education: extractedData?.education,
      summary: extractedData?.summary,
      skills: extractedData?.skills ?? [],
      extractedData: extractedData ?? undefined,
      isProcessed: extractedData !== null,
    })
    .returning();

  return inserted[0]!;
};

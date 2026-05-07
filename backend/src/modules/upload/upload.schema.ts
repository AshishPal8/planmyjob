import { z } from "zod";

export const uploadResumeSchema = z.object({
  mimetype: z.enum(
    [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    { message: "Only PDF or DOCX files are allowed" },
  ),
  size: z.number().max(10 * 1024 * 1024, "File must be under 10MB"),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;

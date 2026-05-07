import { z } from "zod";

export const extractedResumeSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  currentTitle: z.string().optional(),
  experienceYears: z.number().optional(),
  education: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export type ExtractedResume = z.infer<typeof extractedResumeSchema>;

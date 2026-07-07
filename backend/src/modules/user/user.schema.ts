import { z } from "zod";

const workExperienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degreeTitle: z.string(),
  university: z.string(),
  location: z.string().optional(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date().optional(),
  isCurrent: z.boolean().default(false),
  percentage: z.number().optional(),
});

export const updateProfileSchema = z.object({
  // users table
  name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),

  // user_profiles table
  headline: z.string().optional(),
  about: z.string().optional(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  openToWork: z.boolean().optional(),

  // collections — full replace when provided
  workExperiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

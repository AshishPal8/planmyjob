import { z } from "zod";

const workExperienceSchema = z.object({
  title: z.string().min(1).max(150),
  company: z.string().min(1).max(150),
  location: z.string().max(255).optional(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degreeTitle: z.string().min(1).max(150),
  university: z.string().min(1).max(255),
  location: z.string().max(255).optional(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date().optional(),
  isCurrent: z.boolean().default(false),
  percentage: z.number().min(0).max(100).optional(),
});

export const updateProfileSchema = z
  .object({
    // users table
    name: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    location: z.string().max(255).optional(),

    // user_profiles table
    headline: z.string().max(150).optional(),
    about: z.string().optional(),
    skills: z.array(z.string().min(1)).optional(),
    resumeUrl: z.url().optional(),
    linkedinUrl: z.url().optional(),
    githubUrl: z.url().optional(),
    portfolioUrl: z.url().optional(),
    openToWork: z.boolean().optional(),

    // collections — full replace when provided
    workExperiences: z.array(workExperienceSchema).optional(),
    educations: z.array(educationSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

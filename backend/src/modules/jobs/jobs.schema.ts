import { z } from "zod";

export const getJobsSchema = z.object({
  title: z.string().trim().optional(),

  experience: z.number().min(0).optional(),

  skills: z.array(z.string()).default([]),

  locations: z.array(z.string()).default([]),

  jobType: z
    .enum([
      "full_time",
      "part_time",
      "contract",
      "freelance",
      "internship",
      "remote",
    ])
    .optional(),

  page: z.number().min(1).default(1),

  pageSize: z.number().min(1).max(100).default(20),
});

export type GetJobsInput = z.infer<typeof getJobsSchema>;

import { z } from "zod";

export const remotiveJobSchema = z.object({
  id: z.number(),
  url: z.url(),
  title: z.string(),
  company_name: z.string(),
  company_logo: z.string().nullable().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  job_type: z.string().nullable().optional(),
  publication_date: z.string(),
  candidate_required_location: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const jsearchJobSchema = z.object({
  job_id: z.string(),
  job_title: z.string(),
  employer_name: z.string(),
  employer_logo: z.string().nullable().optional(),
  employer_website: z.string().nullable().optional(),
  job_employment_type: z.string().nullable().optional(),
  job_description: z.string().nullable().optional(),
  job_apply_link: z.string().nullable().optional(),
  job_city: z.string().nullable().optional(),
  job_country: z.string().nullable().optional(),
  job_posted_at_datetime_utc: z.string().nullable().optional(),
  job_min_salary: z.number().nullable().optional(),
  job_max_salary: z.number().nullable().optional(),
  job_required_skills: z.array(z.string()).nullable().optional(),
});

export const remotiveResponseSchema = z.object({
  jobs: z.array(remotiveJobSchema),
});

export const jsearchResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    jobs: z.array(jsearchJobSchema),
    cursor: z.string().optional(),
  }),
});

export type RemotiveJob = z.infer<typeof remotiveJobSchema>;
export type JSearchJob = z.infer<typeof jsearchJobSchema>;

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "freelance"
  | "internship"
  | "remote";
export type JobSource = "remotive" | "jsearch" | "manual";

export type NormalizedJob = {
  title: string;
  company: string;
  companyLogo: string | null;
  companyDomain: string | null;
  location: string;
  description: string | null;
  skills: string[];
  salary: string | null;
  jobType: JobType;
  category: string | null;
  applyUrl: string | null;
  source: JobSource;
  sourceId: string | null;
  sourceUrl: string | null;
  postedAt: Date;
};

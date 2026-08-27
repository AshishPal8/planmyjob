import { z } from "zod";

export const checkATSInputSchema = z.object({
  jobDescription: z.string().max(10000).optional(),
  targetRole: z.string().max(150).optional(),
  jobId: z.coerce.number().int().positive().optional(),
});

export type CheckATSInput = z.infer<typeof checkATSInputSchema>;

export const atsMetricDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().min(0).max(100),
  status: z.enum(["pass", "fail", "warning"]),
  summary: z.string(),
  findings: z.array(z.string()),
  tips: z.array(z.string()),
});

export const atsBulletSuggestionSchema = z.object({
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
  metric: z.string().optional(),
});

export const atsAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  verdict: z.enum([
    "Ready to Apply",
    "Good Match",
    "Needs Improvement",
    "High Risk of Rejection",
  ]),
  summaryText: z.string(),
  targetRole: z.string(),
  metrics: z.object({
    bulletPoints: atsMetricDetailSchema,
    quantifiableMetrics: atsMetricDetailSchema,
    grammarAndTone: atsMetricDetailSchema,
    keywordsAndSkills: atsMetricDetailSchema,
    formattingAndHierarchy: atsMetricDetailSchema,
    contactInformation: atsMetricDetailSchema,
    brevityAndLength: atsMetricDetailSchema,
  }),
  skillsFound: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  bulletSuggestions: z.array(atsBulletSuggestionSchema),
  generalSuggestions: z.array(z.string()),
  parsedResume: z.object({
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    currentTitle: z.string().nullable().optional(),
    experienceYears: z.number().nullable().optional(),
    summary: z.string().nullable().optional(),
    skills: z.array(z.string()).optional(),
  }),
});

export type ATSAnalysisResult = z.infer<typeof atsAnalysisResultSchema>;

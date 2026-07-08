import { z } from "zod";

// DB column limits (see db/schema/resume.schema.ts) — truncate defensively so a
// verbose/malformed AI response can never fail the insert with a "value too long" error.
const truncated = (max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v ? v.trim().slice(0, max) || undefined : undefined));

export const extractedResumeSchema = z.object({
  name: truncated(100),
  // don't hard-fail extraction on a malformed email — just drop it
  email: z
    .string()
    .optional()
    .transform((v) => (v && z.email().safeParse(v).success ? v.slice(0, 255) : undefined)),
  phone: truncated(20),
  currentTitle: truncated(150),
  experienceYears: z
    .number()
    .optional()
    .transform((v) =>
      v == null || Number.isNaN(v) ? undefined : Math.min(60, Math.max(0, Math.round(v * 10) / 10)),
    ),
  education: z.string().optional(),
  summary: z.string().optional(),
  skills: z
    .array(z.string())
    .default([])
    .transform((skills) => skills.map((s) => s.trim().slice(0, 100)).filter(Boolean)),
});

export type ExtractedResume = z.infer<typeof extractedResumeSchema>;

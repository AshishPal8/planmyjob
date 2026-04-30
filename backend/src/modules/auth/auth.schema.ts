import { z } from "zod";

export const googleUserSchema = z.object({
  googleId: z.string(),
  email: z.email(),
  name: z.string(),
  profilePicture: z.url().optional(),
});

export type GoogleUser = z.infer<typeof googleUserSchema>;

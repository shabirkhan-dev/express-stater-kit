import { z } from "zod";

export const userSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().min(1).max(100),
  password: z.string().min(8),
});

export type UserSchema = z.infer<typeof userSchema>;
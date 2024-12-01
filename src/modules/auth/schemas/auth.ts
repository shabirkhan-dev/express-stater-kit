import { z } from "zod";

// Email schema with detailed error messages
const emailSchema = z.string({
  required_error: "Email is required",
  invalid_type_error: "Email must be a string"
})
.trim()
.min(1, { message: "Email cannot be empty" })
.max(100, { message: "Email must be less than 100 characters" })
.email({ message: "Invalid email address format" });

// Password schema with detailed error messages
const passwordSchema = z.string({
  required_error: "Password is required",
  invalid_type_error: "Password must be a string"
})
.min(8, { message: "Password must be at least 8 characters long" })
.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
.regex(/[0-9]/, { message: "Password must contain at least one number" })
.regex(/[!@#$%^&*()]/, { message: "Password must contain at least one special character" });

// Registration schema with comprehensive validation
export const registerSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
  .trim()
  .min(1, { message: "Name cannot be empty" })
  .max(100, { message: "Name must be less than 100 characters" }),

  email: emailSchema,

  password: passwordSchema,

  confirmPassword: passwordSchema,

  userAgent: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

// Type inference
export type RegisterSchema = z.infer<typeof registerSchema>;
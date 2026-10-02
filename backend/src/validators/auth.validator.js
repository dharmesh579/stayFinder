import { email, z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

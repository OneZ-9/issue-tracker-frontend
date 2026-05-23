import { z } from "zod";
import { USER_ROLES } from "../constants/user-constants";

const nameSchema = z
  .string()
  .min(2, "Name must be between 2 and 50 characters")
  .max(50, "Name must be between 2 and 50 characters")
  .trim()
  .optional();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

const otpSchema = z
  .string()
  .min(1, "OTP is required")
  .length(6, "OTP must be 6 characters");

const roleSchema = z
  .enum(Object.values(USER_ROLES) as [string, ...string[]], {
    message: "Invalid role",
  })
  .optional();

export const createUserFormSchema = z.object({
  name: nameSchema,
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: passwordSchema,
  role: roleSchema,
  isActive: z.boolean().optional(),
  otp: otpSchema,
});

export const userSignInFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const userUpdateFormSchema = z.object({
  name: nameSchema,
  role: roleSchema,
  isActive: z.boolean().optional(),
});

export const userResetPasswordFormSchema = z.object({
  password: passwordSchema,
  otp: otpSchema,
});

export type CreateUserPayload = z.infer<typeof createUserFormSchema>;
export type UserSignInPayload = z.infer<typeof userSignInFormSchema>;
export type UserUpdatePayload = z.infer<typeof userUpdateFormSchema>;
export type UserResetPasswordPayload = z.infer<
  typeof userResetPasswordFormSchema
>;

import { z } from "zod";

export const otpFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Valid email is required"),
});

export type OtpPayload = z.infer<typeof otpFormSchema>;

import { z } from "zod";

export const createSpaceFormSchema = z.object({
  name: z
    .string()
    .min(1, "Space name is required")
    .min(4, "Space name must be between 4 and 100 characters")
    .max(100, "Space name must be between 4 and 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional(),
});

export const updateSpaceFormSchema = z.object({
  name: z
    .string()
    .min(4, "Space name must be between 4 and 100 characters")
    .max(100, "Space name must be between 4 and 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional(),
});

export type CreateSpacePayload = z.infer<typeof createSpaceFormSchema>;
export type UpdateSpacePayload = z.infer<typeof updateSpaceFormSchema>;

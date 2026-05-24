import { z } from "zod";
import {
  TICKET_PRIORITY,
  TICKET_SEVERITY,
  TICKET_STATUS,
} from "../constants/ticket-constants";

const mongoIdRegex = /^[a-f\d]{24}$/i;

const titleSchema = z
  .string()
  .min(1, "Title is required")
  .min(3, "Title must be between 3 and 200 characters")
  .max(200, "Title must be between 3 and 200 characters")
  .trim();

const descriptionSchema = z
  .string()
  .max(5000, "Description must not exceed 5000 characters")
  .trim()
  .optional();

const prioritySchema = z
  .enum(Object.values(TICKET_PRIORITY) as [string, ...string[]], {
    message: `Priority must be one of: ${Object.values(TICKET_PRIORITY).join(", ")}`,
  })
  .optional();

const severitySchema = z
  .enum(Object.values(TICKET_SEVERITY) as [string, ...string[]], {
    message: `Severity must be one of: ${Object.values(TICKET_SEVERITY).join(", ")}`,
  })
  .optional();

const assigneeSchema = z
  .string()
  .regex(mongoIdRegex, "Invalid assignee ID")
  .nullable()
  .optional();

export const createTicketFormSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  severity: severitySchema,
  assignee: assigneeSchema,
});

export const updateTicketFormSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  priority: prioritySchema,
  severity: severitySchema,
  assignee: assigneeSchema,
});

export const updateTicketStatusFormSchema = z.object({
  status: z.enum(Object.values(TICKET_STATUS) as [string, ...string[]], {
    message: `Status must be one of: ${Object.values(TICKET_STATUS).join(", ")}`,
  }),
});

export const listTicketsQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be a positive integer")
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be between 1 and 100")
    .max(100, "Limit must be between 1 and 100")
    .optional(),
  status: z
    .enum(Object.values(TICKET_STATUS) as [string, ...string[]], {
      message: `Status must be one of: ${Object.values(TICKET_STATUS).join(", ")}`,
    })
    .optional(),
  priority: z
    .enum(Object.values(TICKET_PRIORITY) as [string, ...string[]], {
      message: `Priority must be one of: ${Object.values(TICKET_PRIORITY).join(", ")}`,
    })
    .optional(),
  severity: z
    .enum(Object.values(TICKET_SEVERITY) as [string, ...string[]], {
      message: `Severity must be one of: ${Object.values(TICKET_SEVERITY).join(", ")}`,
    })
    .optional(),
  assignee: z
    .string()
    .regex(mongoIdRegex, "Invalid assignee ID")
    .nullable()
    .optional(),
  sortBy: z
    .enum(["ticketId", "priority", "createdAt", "updatedAt"], {
      message:
        "sortBy must be one of: ticketId, priority, createdAt, updatedAt",
    })
    .optional(),
  sortOrder: z
    .enum(["asc", "desc"], { message: "sortOrder must be asc or desc" })
    .optional(),
});

export const exportTicketsQuerySchema = listTicketsQuerySchema.extend({
  format: z
    .enum(["json", "csv"], { message: "format must be 'json' or 'csv'" })
    .optional(),
});

export type CreateTicketPayload = z.infer<typeof createTicketFormSchema>;
export type UpdateTicketPayload = z.infer<typeof updateTicketFormSchema>;
export type UpdateTicketStatusPayload = z.infer<
  typeof updateTicketStatusFormSchema
>;
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
export type ExportTicketsQuery = z.infer<typeof exportTicketsQuerySchema>;

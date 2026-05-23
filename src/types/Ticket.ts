import type { Space } from "./Space";
import type { User } from "./User";
import type {
  TICKET_PRIORITY,
  TICKET_SEVERITY,
  TICKET_STATUS,
} from "@/constants/ticket-constants";

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
export type TicketPriority =
  (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY];
export type TicketSeverity =
  (typeof TICKET_SEVERITY)[keyof typeof TICKET_SEVERITY];

export type Ticket = {
  _id: string;
  ticketId: string;
  ticketNum: number;
  space: string | Partial<Space>;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  severity: TicketSeverity;
  assignee: string | Partial<User> | null;
  reporter: string | Partial<User>;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

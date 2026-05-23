import type { User } from "./User";

export type Space = {
  _id: string;
  name: string;
  spaceKey: string;
  description: string;
  owner: string | Partial<User>;
  ticketCounter: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

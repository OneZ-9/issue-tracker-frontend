import type { USER_ROLES } from "@/constants/user-constants";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

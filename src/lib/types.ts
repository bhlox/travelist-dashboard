import { blockedSchedules, user } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export interface DatabaseUserAttributes {
  username: string;
  role: "staff" | "admin" | "owner";
}

export interface ISidebarContext {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export type SelectUser = InferSelectModel<typeof user>;
export type InsertUser = InferInsertModel<typeof user>;
export type UpdateUser = {
  id: InsertUser["id"];
  password?: string;
} & Partial<Omit<InsertUser, "id">>;

export type SelectBlockedSchedule = InferSelectModel<typeof blockedSchedules>;
export type InsertBlockedSchedule = InferInsertModel<typeof blockedSchedules>;
export type UpdateBlockedSchedule = {
  id: InsertBlockedSchedule["id"];
} & Partial<Omit<InsertBlockedSchedule, "id">>;

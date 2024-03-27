import { blockedSchedules, bookings, user } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { bookingStatuses } from "./constants";

export interface DatabaseUserAttributes {
  username: string;
  role: "staff" | "admin" | "owner";
}

export interface ISidebarContext {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export type SelectBooking = InferSelectModel<typeof bookings>;
export type InsertBooking = InferInsertModel<typeof bookings>;
export type UpdateBooking = {
  id: SelectBooking["id"];
} & Partial<Omit<InsertBooking, "id">>;

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

export type ScheduleBlock = "day" | "time";

export type ScheduleBlockInfo = {
  date: Date;
  timeRanges: string[];
  type: ScheduleBlock;
};

export type ScheduleBlockInfoWithId = {
  date: Date;
  timeRanges: string[];
  type: ScheduleBlock;
  id: number;
};

export type UpdateScheduleFormProps = {
  blockedSchedules: ScheduleBlockInfo[];
  submitType: "create" | "update";
  editId?: string;
  toBeEditedBlockedSchedule?: ScheduleBlockInfo;
  isModal?: boolean;
} & (
  | {
      submitType: "create";
      editId?: string;
      toBeEditedBlockedSchedule?: ScheduleBlockInfo;
      isModal?: boolean;
    }
  | {
      submitType: "update";
      editId: string;
      toBeEditedBlockedSchedule: ScheduleBlockInfo;
      isModal: boolean;
    }
);

export type BookingStatus = (typeof bookingStatuses)[number];

export type DialogEditStatusProps = {
  currentStatus: BookingStatus | undefined;
  name: string | undefined;
  id: number | undefined;
};

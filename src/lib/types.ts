import { blockedSchedules, bookings, user } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  BOOKING_STATUSES,
  BOOKING_URL_QUERYPARAM_FILTERS,
  USER_ROLES,
} from "./constants";
import { ColumnDef, Table } from "@tanstack/react-table";

export interface DatabaseUserAttributes {
  username: string;
  displayname: string;
  role: UserRoles;
  testRole?: UserRoles;
  email: string;
  email_verified: boolean;
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
export type GlobalSearchUser = { role: "admin" | "staff" | "developer" } & Omit<
  SelectUser,
  "hashedPassword" | "testRole" | "role"
>;
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

export type ScheduleBlockType = "day" | "time";

export type ScheduleBlockData = { timeRanges: string[]; date: Date } & Omit<
  SelectBlockedSchedule,
  "timeRanges" | "date"
>;

export type ScheduleBlockWithRelations = ScheduleBlockData & {
  handler: { displayname: string };
  approver: { displayname: string } | null;
};

export type UpdateScheduleFormProps = {
  blockedSchedules: ScheduleBlockData[];
  submitType: "create" | "update";
  editId?: string;
  toBeEditedBlockedSchedule?: ScheduleBlockData;
  isModal?: boolean;
  bookings: SelectBooking[];
} & (
  | {
      submitType: "create";
      editId?: string;
      toBeEditedBlockedSchedule?: ScheduleBlockData;
      isModal?: boolean;
    }
  | {
      submitType: "update";
      editId: string;
      toBeEditedBlockedSchedule: ScheduleBlockData;
      isModal: boolean;
    }
);

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type DialogEditStatusProps = {
  currentStatus: BookingStatus | undefined;
  name: string | undefined;
  id: number | undefined;
};

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export interface DataTableProps<TData> {
  // columns?: ColumnDef<TData, TValue>[];
  data: TData[];
  searchParams: { [key: string]: string };
  pageCount: number;
}

export type UserRoles = (typeof USER_ROLES)[number];

export type BookingsSlugAction = "edit" | "delete";

export type DeleteDialogConfirmationProps = {
  idToBeDeleted: number | string;
  sucessMsg: { title: string; description: string | undefined };
  errorMsg: string;
  setDeleteDialog?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  setUserDataUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  dialogTitle: string;
  dialogDescription: React.ReactNode;
  deleteFn: (id: any) => Promise<void>;
  redirectTo?: string | null;
};

export type FindUser = {
  username?: string;
  email?: string;
  withPassword: boolean;
} & (
  | { username: string; email?: string }
  | { username?: string; email: string }
);

export type GetSchedulesProps = {
  all?: boolean;
  handlerId?: string;
  filters?: { pendingStatus?: true };
} & ({ all: true } | { all?: false; handlerId: string });

export type BookingURLQueryParamFilters =
  (typeof BOOKING_URL_QUERYPARAM_FILTERS)[number];

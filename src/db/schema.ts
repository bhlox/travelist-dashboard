import { BookingStatus, UserRoles } from "@/lib/types";
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  date,
  time,
  varchar,
  timestamp,
  text,
  json,
  boolean,
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey().notNull(),
  selectedDate: date("selected_date").notNull(),
  selectedTime: time("selected_time").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  handler: text("handler")
    .notNull()
    .references(() => user.id),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  status: text("status").$type<BookingStatus>().default("pending"),
  bookedAt: timestamp("booked_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayname: text("display_name").notNull().default("person"),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role").$type<UserRoles>().default("staff"),
  testRole: text("test_role").$type<UserRoles>(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  description: text("description"),
  profilePicture: text("profile_picture")
    .notNull()
    .default("/avatar_default.jpg"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const blockedSchedules = pgTable("blocked_schedules", {
  id: serial("id").primaryKey().notNull(),
  personnel: text("personnel")
    .notNull()
    .references(() => user.id),
  type: text("type").$type<"day" | "time">().notNull(),
  date: date("date").notNull(),
  timeRanges: json("time_ranges"),
  comment: text("comment"),
  approved: boolean("approved").notNull().default(false),
  statusUpdatedBy: text("status_updated_by").references(() => user.id),
});

export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: serial("id").primaryKey().notNull(),
  email: text("email")
    .notNull()
    .references(() => user.email),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  handler: one(user, {
    fields: [bookings.handler],
    references: [user.id],
  }),
}));

export const blockedSchedulesRelations = relations(
  blockedSchedules,
  ({ one }) => ({
    approver: one(user, {
      fields: [blockedSchedules.statusUpdatedBy],
      references: [user.id],
    }),
    handler: one(user, {
      fields: [blockedSchedules.personnel],
      references: [user.id],
    }),
  })
);

export const usersRelations = relations(user, ({ many }) => ({
  bookings: many(bookings),
  sessions: many(session),
  blockedSchedules: many(blockedSchedules),
  emailVerificationCodes: many(emailVerificationCodes),
}));

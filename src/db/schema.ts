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
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey().notNull(),
  selectedDate: date("selected_date").notNull(),
  selectedTime: time("selected_time").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  personInCharge: varchar("person_in_charge", { length: 100 }).notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  bookedAt: timestamp("booked_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role").$type<"admin" | "staff" | "owner">().default("staff"),
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
  personnel: text("personnel").notNull(),
  type: text("type").$type<"day" | "time">().notNull(),
  date: date("date").notNull(),
  timeRanges: json("time_ranges"),
});

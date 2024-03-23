import {
  pgTable,
  pgEnum,
  serial,
  date,
  time,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const keyType = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);
export const factorType = pgEnum("factor_type", ["totp", "webauthn"]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);

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

import { z } from "zod";
import { openingHours, userRoles } from "./constants";

export const dateSchema = z.object({
  selectedDate: z.date({
    required_error: "A date of birth is required.",
  }),
});
export const timeSchema = z.object({
  selectedDate: z.date({
    required_error: "A date of birth is required.",
  }),
  startTime: z.string().refine((time) => openingHours.includes(time), {
    message: "Start time must be within opening hours.",
  }),
  endTime: z.string().refine((time) => openingHours.includes(time), {
    message: "End time must be within opening hours.",
  }),
});

export const ProfileFormSchema = z.object({
  displayname: z
    .string({ invalid_type_error: "Invalid isplay name" })
    .optional(),
  username: z.string({ invalid_type_error: "Invalid user name" }).optional(),
  testRole: z
    .enum(userRoles, {
      invalid_type_error: "Invalid user role",
    })
    .optional(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
});

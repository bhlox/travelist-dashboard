import { z } from "zod";
import { openingHours } from "./constants";

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

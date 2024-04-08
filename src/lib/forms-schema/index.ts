import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  openingHours,
  sizeInMB,
  userRoles,
} from "../constants";

export const dateSchema = z.object({
  selectedDate: z.date({
    required_error: "A date of birth is required.",
  }),
  comment: z.string().optional(),
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
  comment: z.string().optional(),
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
    .nullable()
    .optional(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  description: z.string().optional(),
  profilePicture: z
    .custom<File>()
    // .refine((files) => {
    //   return Array.from(files ?? []).length !== 0;
    // }, "Image is required")
    .refine((file) => {
      return sizeInMB(file.size) <= MAX_IMAGE_SIZE;
      // return Array.from(files ?? []).every(
      //   (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE
      // );
    }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
      // return Array.from(files ?? []).every((file) =>
      //   ACCEPTED_IMAGE_TYPES.includes(file.type)
      // );
    }, "File type is not supported"),
});

export const loginFormSchema = z.object({
  usernameOrEmail: z.string().min(4).max(50),
  password: z.string().max(254),
});

export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters" })
      .max(50),
    displayname: z.string().optional(),
    email: z.string().email(),
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords are not matching",
    path: ["confirm"],
  });

"use server";

import { db } from "@/db";
import { UpdateBooking } from "../types";
import { eq } from "drizzle-orm";
import { bookings } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getBookingsForDate = async (date: string) => {
  return await db.query.bookings.findMany({
    where: (bookings, { eq }) => eq(bookings.selectedDate, date),
  });
};

export const getBookings = async () => {
  return await db.query.bookings.findMany();
};

export const updateBooking = async (data: UpdateBooking) => {
  if (!data.id) throw new Error("No id found for updating booking");
  await db.update(bookings).set(data).where(eq(bookings.id, data.id));
  revalidatePath("/bookings");
};

"use server";

import { db } from "@/db";
import { UpdateBooking } from "../types";
import { eq } from "drizzle-orm";
import { bookings } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getBooking = async (id: number) => {
  return await db.query.bookings.findFirst({
    where: (bookings, { eq }) => eq(bookings.id, id),
    // columns: { status: true, customerName: true },
  });
};

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

export const updateBookings = async (data: UpdateBooking[]) => {
  for (const booking of data) {
    if (!booking.id) {
      console.error("no booking id found");
      continue;
    }
    await db.update(bookings).set(booking).where(eq(bookings.id, booking.id));
  }
  revalidatePath("/bookings");
};

export const deleteBooking = async (id: number) => {
  await db.delete(bookings).where(eq(bookings.id, id));
  revalidatePath("/bookings");
};

export const deleteBookings = async (ids: number[]) => {
  for (const id of ids) {
    await db.delete(bookings).where(eq(bookings.id, id));
  }
  revalidatePath("/bookings");
};

"use server";

import { db } from "@/db";

export const getCustomersForDate = async (date: string) => {
  return await db.query.bookings.findMany({
    where: (bookings, { eq }) => eq(bookings.selectedDate, date),
  });
};

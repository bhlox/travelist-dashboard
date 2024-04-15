"use server";

import { db } from "@/db";
import { UpdateBooking, UserRoles } from "../types";
import { eq } from "drizzle-orm";
import { bookings } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getBooking = async (id: number) => {
  return await db.query.bookings.findFirst({
    where: (bookings, { eq }) => eq(bookings.id, id),
    with: { handler: { columns: { id: true, displayname: true } } },
    // columns: { status: true, customerName: true },
  });
};

export const getBookingsForDate = async ({
  date,
  handlerId,
}: {
  date: string;
  handlerId: string;
}) => {
  return await db.query.bookings.findMany({
    where: (bookings, { eq, and }) =>
      and(eq(bookings.selectedDate, date), eq(bookings.handler, handlerId)),
  });
};

export const getBookings = async ({
  handlerId,
  role,
  testRole,
  filters,
}: {
  // handlerId is the ID of the current user who is requesting the data. while filters.id indicates which userID are we requesting. this can be the current user or another user
  handlerId: string;
  role: UserRoles;
  testRole?: UserRoles;
  filters?: {
    offset?: number;
    limit?: number;
    id?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}) => {
  if (testRole === "staff") {
    return await db.query.bookings.findMany({
      where: (bookings, { eq }) => eq(bookings.handler, handlerId),
    });
  }
  if (role !== "staff") {
    if (filters) {
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        return await db.query.bookings.findMany({
          where: (bookings, { and, gte, lte, eq }) =>
            and(
              gte(bookings.selectedDate, start),
              lte(bookings.handler, end),
              filters.id ? eq(bookings.handler, filters.id) : undefined
            ),
        });
      }
    }
    const data = await db.query.bookings.findMany({
      with: {
        handler: { columns: { displayname: true } },
      },
    });
    return data.map((dat) => ({ ...dat, handler: dat.handler?.displayname }));
  } else {
    return await db.query.bookings.findMany({
      where: (bookings, { eq }) => eq(bookings.handler, handlerId),
    });
  }
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

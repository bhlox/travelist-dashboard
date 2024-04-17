"use server";

import { db } from "@/db";
import {
  BookingStatus,
  SelectBooking,
  UpdateBooking,
  UserRoles,
} from "../types";
import { and, count, eq, gt, gte, lt, lte } from "drizzle-orm";
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
  filters = { pageNumber: 1 },
}: {
  // handlerId is the ID of the current user who is requesting the data. while filters.id indicates which userID are we requesting. this can be the current user or another user
  handlerId: string;
  role: UserRoles;
  testRole?: UserRoles;
  filters?:
    | ({
        getPageCount?: boolean;
        pageNumber?: number;
        limit?: number;
        id?: string;
        dateRange?: {
          start: string;
          end: string;
        };
        sort?: {
          field: keyof SelectBooking;
          direction: "asc" | "desc";
        };
        status?: BookingStatus;
      } & {
        getPageCount?: false;
        limit?: number;
        id?: string;
        dateRange?: {
          start: string;
          end: string;
        };
        sort?: {
          field: keyof SelectBooking;
          direction: "asc" | "desc";
        };
        status?: BookingStatus;
      })
    | {
        getPageCount: true;
        pageNumber: number;
        limit?: number;
        id?: string;
        dateRange?: {
          start: string;
          end: string;
        };
        sort?: {
          field: keyof SelectBooking;
          direction: "asc" | "desc";
        };
        status?: BookingStatus;
      };
}): Promise<{ count?: number; data: SelectBooking[] }> => {
  if (testRole === "staff") {
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const dataLength = await db
        .select({ totalCount: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.handler, handlerId),
            gte(bookings.selectedDate, filters.dateRange.start),
            lte(bookings.selectedDate, filters.dateRange.end)
          )
        );
      const totalCount = Math.ceil(dataLength[0].totalCount / 10);
      return {
        data: await db.query.bookings.findMany({
          where: (bookings, { eq, and, gte, lte }) =>
            and(
              eq(bookings.handler, handlerId),
              gte(bookings.selectedDate, filters.dateRange!.start),
              lte(bookings.selectedDate, filters.dateRange!.end)
            ),
          limit: filters.getPageCount ? 10 : undefined,
          offset: filters.getPageCount
            ? (filters.pageNumber - 1) * 10
            : undefined,
          orderBy: filters.sort?.direction
            ? (bookings, { asc, desc }) =>
                filters.sort?.direction === "asc"
                  ? [asc(bookings[filters.sort!.field])]
                  : [desc(bookings[filters.sort!.field])]
            : undefined,
        }),
        count: totalCount,
      };
    } else {
      const dataLength = await db
        .select({ totalCount: count() })
        .from(bookings)
        .where(eq(bookings.handler, handlerId));
      const totalCount = Math.ceil(dataLength[0].totalCount / 10);
      return {
        data: await db.query.bookings.findMany({
          where: (bookings, { eq, and, gte, lte }) =>
            eq(bookings.handler, handlerId),
          limit: filters.getPageCount ? 10 : undefined,
          offset: filters.getPageCount
            ? (filters.pageNumber - 1) * 10
            : undefined,
          orderBy: filters.sort?.direction
            ? (bookings, { asc, desc }) =>
                filters.sort?.direction === "asc"
                  ? [asc(bookings[filters.sort!.field])]
                  : [desc(bookings[filters.sort!.field])]
            : undefined,
        }),
        count: totalCount,
      };
    }
  }
  if (role !== "staff") {
    const data = await db.query.bookings.findMany({
      where: (bookings, { and, eq }) =>
        and(
          filters.dateRange?.start
            ? gte(bookings.selectedDate, filters.dateRange?.start)
            : undefined,
          filters.dateRange?.end
            ? lte(bookings.selectedDate, filters.dateRange?.end)
            : undefined,
          filters.id ? eq(bookings.handler, filters.id) : undefined,
          filters.status ? eq(bookings.status, filters.status) : undefined
        ),
      with: {
        handler: { columns: { displayname: true } },
      },
      limit: filters.getPageCount ? 10 : undefined,
      offset: filters.getPageCount ? (filters.pageNumber - 1) * 10 : undefined,
      orderBy: filters.sort?.direction
        ? (bookings, { asc, desc }) =>
            filters.sort?.direction === "asc"
              ? [asc(bookings[filters.sort!.field])]
              : [desc(bookings[filters.sort!.field])]
        : undefined,
    });
    const dataLength = await db
      .select({ totalCount: count() })
      .from(bookings)
      .where(
        and(
          filters.dateRange?.start
            ? gte(bookings.selectedDate, filters.dateRange?.start)
            : undefined,
          filters.dateRange?.end
            ? lte(bookings.selectedDate, filters.dateRange?.end)
            : undefined,
          filters.id ? eq(bookings.handler, filters.id) : undefined,
          filters.status ? eq(bookings.status, filters.status) : undefined
        )
      );
    const totalCount = Math.ceil(dataLength[0].totalCount / 10);
    const formattedData = data.map((dat) => ({
      ...dat,
      handler: dat.handler?.displayname,
    }));
    return { data: formattedData, count: totalCount };
  } else {
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const dataLength = await db
        .select({ totalCount: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.handler, handlerId),
            gte(bookings.selectedDate, filters.dateRange.start),
            lte(bookings.selectedDate, filters.dateRange.end)
          )
        );
      const totalCount = Math.ceil(dataLength[0].totalCount / 10);
      return {
        data: await db.query.bookings.findMany({
          where: (bookings, { eq, and, gte, lte }) =>
            and(
              eq(bookings.handler, handlerId),
              gte(bookings.selectedDate, filters.dateRange!.start),
              lte(bookings.selectedDate, filters.dateRange!.end)
            ),
          limit: filters.getPageCount ? 10 : undefined,
          offset: filters.getPageCount
            ? (filters.pageNumber - 1) * 10
            : undefined,
          orderBy: filters.sort?.direction
            ? (bookings, { asc, desc }) =>
                filters.sort?.direction === "asc"
                  ? [asc(bookings[filters.sort!.field])]
                  : [desc(bookings[filters.sort!.field])]
            : undefined,
        }),
        count: totalCount,
      };
    } else {
      const dataLength = await db
        .select({ totalCount: count() })
        .from(bookings)
        .where(eq(bookings.handler, handlerId));
      const totalCount = Math.ceil(dataLength[0].totalCount / 10);
      return {
        data: await db.query.bookings.findMany({
          where: (bookings, { eq, and, gte, lte }) =>
            eq(bookings.handler, handlerId),
          limit: filters.getPageCount ? 10 : undefined,
          offset: filters.getPageCount
            ? (filters.pageNumber - 1) * 10
            : undefined,
          orderBy: filters.sort?.direction
            ? (bookings, { asc, desc }) =>
                filters.sort?.direction === "asc"
                  ? [asc(bookings[filters.sort!.field])]
                  : [desc(bookings[filters.sort!.field])]
            : undefined,
        }),
        count: totalCount,
      };
    }
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

export const updatePendingBooksToOverdue = async () => {
  const updatedIds = await db
    .update(bookings)
    .set({ status: "overdue" })
    .where(
      and(
        eq(bookings.status, "pending"),
        lt(bookings.selectedDate, new Date().toISOString().split("T")[0])
      )
    )
    .returning({ id: bookings.id });
  revalidatePath("/bookings");
  return updatedIds.length;
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

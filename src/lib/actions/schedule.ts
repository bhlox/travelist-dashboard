"use server";

import { blockedSchedules } from "@/db/schema";
import {
  GetSchedulesProps,
  InsertBlockedSchedule,
  UpdateBlockedSchedule,
} from "../types";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { count, eq, sql } from "drizzle-orm";

export const createBlockedSchedule = async (data: InsertBlockedSchedule) => {
  await db.insert(blockedSchedules).values(data);
  revalidatePath("/schedule");
};

export const getAllBlockedSchedules = async () => {
  return await db.query.blockedSchedules.findMany();
};

// #TODO fix the return type and the data that is needed.
export const getSchedules = async ({
  handlerId,
  all,
  filters,
}: GetSchedulesProps) => {
  if (handlerId) {
    return await db.query.blockedSchedules.findMany({
      where: (blockedSchedules, { eq }) =>
        eq(blockedSchedules.handlerID, handlerId),
      with: {
        handler: { columns: { displayname: true } },
        approver: { columns: { displayname: true } },
      },
    });
  }
  if (all) {
    return await db.query.blockedSchedules.findMany({
      with: {
        handler: { columns: { displayname: true } },
        approver: { columns: { displayname: true } },
      },
      where: (blockedSchedules, { and, isNull }) =>
        and(
          filters?.pendingStatus
            ? isNull(blockedSchedules.statusUpdatedBy)
            : undefined
        ),
    });
  }
};

export const getSchedule = async (id: number) => {
  return await db.query.blockedSchedules.findFirst({
    where: (blockedSchedules, { eq }) => eq(blockedSchedules.id, id),
    with: {
      handler: { columns: { displayname: true } },
      approver: { columns: { displayname: true } },
    },
  });
};

export const getPendingSchedulesLength = async () => {
  const data = await db
    .select({ totalCount: count() }) // Use count() to get the total count
    .from(blockedSchedules)
    .where(sql`status_updated_by IS NULL`) // Apply filter condition
    .execute();
  return data[0].totalCount;
};

export const updateBlockedSchedule = async (data: UpdateBlockedSchedule) => {
  if (!data.id) throw new Error("No id found for updating schedule");
  await db
    .update(blockedSchedules)
    .set(data)
    .where(eq(blockedSchedules.id, data.id));
  revalidatePath("/schedule");
};

export const deleteSchedule = async (id: number) => {
  await db.delete(blockedSchedules).where(eq(blockedSchedules.id, id));
  revalidatePath("/schedule");
};

export const deleteSchedules = async (ids: number[]) => {
  for (const id of ids) {
    await db.delete(blockedSchedules).where(eq(blockedSchedules.id, id));
  }
  revalidatePath("/schedule");
};

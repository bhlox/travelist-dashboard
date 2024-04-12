"use server";

import { blockedSchedules } from "@/db/schema";
import { InsertBlockedSchedule, UpdateBlockedSchedule } from "../types";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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
}: {
  isTime?: boolean;
  username?: string;
  all?: boolean;
  handlerId: string;
}) => {
  // let schedule: {
  //   date: string;
  //   timeRanges?: unknown;
  // }[];
  // if (all) {
  const data = await db.query.blockedSchedules.findMany({
    where: (blockedSchedules, { eq }) =>
      eq(blockedSchedules.personnel, handlerId),
    with: {
      handler: { columns: { displayname: true } },
      approver: { columns: { displayname: true } },
    },
  });
  return data;
  // }
  // if (isTime) {
  //   schedule = await db.query.blockedSchedules.findMany({
  //     columns: { date: true, timeRanges: true },
  //     where: (blockedSchedules, { eq }) =>
  //       eq(blockedSchedules.personnel, username),
  //   });
  // } else {
  //   schedule = await db.query.blockedSchedules.findMany({
  //     columns: { date: true, timeRanges: false },
  //     where: (blockedSchedules, { eq }) =>
  //       eq(blockedSchedules.personnel, username),
  //   });
  // }
  // return schedule;
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

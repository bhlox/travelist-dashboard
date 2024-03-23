"use server";

import { blockedSchedules } from "@/db/schema";
import { InsertBlockedSchedule } from "../types";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const createBlockedSchedule = async (data: InsertBlockedSchedule) => {
  await db.insert(blockedSchedules).values(data);
  revalidatePath("/schedule");
};

export const getSchedules = async ({}: {
  isTime?: boolean;
  username?: string;
  all?: boolean;
}) => {
  // let schedule: {
  //   date: string;
  //   timeRanges?: unknown;
  // }[];
  // if (all) {
  return await db.query.blockedSchedules.findMany({
    columns: { date: true, timeRanges: true, type: true, id: true },
  });
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

export const deleteSchedule = async (id: number) => {
  await db.delete(blockedSchedules).where(eq(blockedSchedules.id, id));
  revalidatePath("/schedule");
};

import React from "react";
import EditBlockScheduleClient from "./client";
import { getSchedule, getSchedules } from "@/lib/actions/schedule";
import { ScheduleBlockData } from "@/lib/types";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { getBookings } from "@/lib/actions/bookings";
import { addDays } from "date-fns";

export default async function EditBlockSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user || !user.user) {
    redirect("/login");
  }
  const blockedSchedules = await getSchedules({ handlerId: user.user.id });
  const mappedData =
    blockedSchedules?.map((day) => ({
      ...day,
      date: new Date(day.date),
      timeRanges: JSON.parse(day.timeRanges as string) as string[],
    })) ?? [];
  const currentBlockedSchedule = await getSchedule(+params.id);
  if (!currentBlockedSchedule) {
    throw new Error("current schedule not found");
  }
  const toBeEditedBlockedSchedule: ScheduleBlockData = {
    ...currentBlockedSchedule,
    date: new Date(currentBlockedSchedule.date),
    timeRanges: JSON.parse(currentBlockedSchedule.timeRanges as string),
  };

  // NOTE: We need `getBookings` to check for conflicts within that booking date. the data fetched is passed towards updatescheduleform component
  const bookings = await getBookings({
    handlerId: user.user.id,
    role: user.user.role,
    testRole: user.user.testRole,
    filters: {
      dateRange: {
        start: new Date().toISOString(),
        end: addDays(new Date(), 31).toISOString(),
      },
      id: user.user.id,
    },
  });

  return (
    <EditBlockScheduleClient
      toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
      blockedSchedules={mappedData}
      editId={params.id}
      bookings={bookings.data}
    />
  );
}

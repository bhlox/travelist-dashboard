import React from "react";
import EditBlockScheduleClient from "./client";
import { getSchedule, getSchedules } from "@/lib/actions/schedule";
import { ScheduleBlockData } from "@/lib/types";

export default async function EditBlockSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const blockedSchedules = await getSchedules({ all: true });
  const mappedData = blockedSchedules.map((day) => ({
    ...day,
    date: new Date(day.date),
    timeRanges: JSON.parse(day.timeRanges as string) as string[],
  }));
  const currentBlockedSchedule = await getSchedule(+params.id);
  if (!currentBlockedSchedule) {
    throw new Error("current schedule not found");
  }
  const toBeEditedBlockedSchedule: ScheduleBlockData = {
    ...currentBlockedSchedule,
    date: new Date(currentBlockedSchedule.date),
    timeRanges: JSON.parse(currentBlockedSchedule.timeRanges as string),
  };
  return (
    <EditBlockScheduleClient
      toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
      blockedSchedules={mappedData}
      editId={params.id}
    />
  );
}

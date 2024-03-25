import React from "react";
import EditBlockScheduleClient from "./client";
import { getSchedule, getSchedules } from "@/lib/actions/schedule";

export default async function EditBlockSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const blockedSchedules = await getSchedules({ all: true });
  const mappedData = blockedSchedules.map((day) => ({
    date: new Date(day.date),
    timeRanges: JSON.parse(day.timeRanges as string),
    type: day.type,
  }));
  const currentBlockedSchedule = await getSchedule(+params.id);
  if (!currentBlockedSchedule) {
    throw new Error("current schedule not found");
  }
  const toBeEditedBlockedSchedule = {
    date: new Date(currentBlockedSchedule.date),
    timeRanges: JSON.parse(currentBlockedSchedule.timeRanges as string),
    type: currentBlockedSchedule.type,
  };
  return (
    <EditBlockScheduleClient
      toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
      blockedSchedules={mappedData}
      editId={params.id}
    />
  );
}

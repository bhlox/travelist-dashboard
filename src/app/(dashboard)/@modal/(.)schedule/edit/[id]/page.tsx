import React from "react";
import ModalEditingBlockedSchedule from "./modal";
import { getSchedule, getSchedules } from "@/lib/actions/schedule";
import { redirect } from "next/navigation";
import { ScheduleBlockData } from "@/lib/types";

export default async function ModesEditingPage({
  params,
}: {
  params: { id: string };
}) {
  const blockedSchedules = await getSchedules({ all: true });
  if (!blockedSchedules) {
    console.error("could not find schedule details");
    redirect("/schedule");
  }
  const mappedblockedSchedules: ScheduleBlockData[] = blockedSchedules.map(
    (day) => ({
      ...day,
      date: new Date(day.date),
      timeRanges: JSON.parse(day.timeRanges as string),
    })
  );
  const currentBlockedSchedule = await getSchedule(+params.id);
  if (!currentBlockedSchedule) {
    throw new Error("current schedule not found");
  }
  const toBeEditedBlockedSchedule = {
    ...currentBlockedSchedule,
    date: new Date(currentBlockedSchedule.date),
    timeRanges: JSON.parse(currentBlockedSchedule.timeRanges as string),
  };
  return (
    <ModalEditingBlockedSchedule
      blockedSchedules={mappedblockedSchedules}
      toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
      editId={params.id}
    />
  );
}

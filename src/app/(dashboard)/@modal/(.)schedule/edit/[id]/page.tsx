import React from "react";
import ModalEditingBlockedSchedule from "./modal";
import { getSchedule, getSchedules } from "@/lib/actions/schedule";
import { redirect } from "next/navigation";

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
  const mappedblockedSchedules = blockedSchedules.map((day) => ({
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
    <ModalEditingBlockedSchedule
      blockedSchedules={mappedblockedSchedules}
      toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
      editId={params.id}
    />
  );
}

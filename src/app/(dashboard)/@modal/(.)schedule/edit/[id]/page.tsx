import React from "react";
import ModalEditingBlockedSchedule from "./modal";
import { getSchedule, getSchedules } from "@/lib/actions/schedule";
import { redirect } from "next/navigation";
import { ScheduleBlockData } from "@/lib/types";
import { getUser } from "@/lib/actions/auth";
import { getBookings } from "@/lib/actions/bookings";
import { addDays } from "date-fns";

export default async function ModesEditingPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user || !user.user) {
    redirect("/login");
  }
  const blockedSchedules = await getSchedules({ handlerId: user.user.id });
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

  // NOTE: We need `getBookings` to check for conflicts within that booking date. the data fetched is passed towards updatescheduleform component.

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
  console.log(bookings);
  return (
    <ModalEditingBlockedSchedule
      blockedSchedules={mappedblockedSchedules}
      toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
      editId={params.id}
      bookings={bookings.data}
    />
  );
}

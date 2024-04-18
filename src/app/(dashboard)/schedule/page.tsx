import { getSchedules } from "@/lib/actions/schedule";
import ScheduleClient from "./client";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { ScheduleBlockWithRelations } from "@/lib/types";
import { getBookings } from "@/lib/actions/bookings";
import { addDays, compareAsc } from "date-fns";

export default async function SchedulePage() {
  const user = await getUser();
  if (!user || !user.user) {
    redirect("/login");
  }
  let allBlockedSchedules: ScheduleBlockWithRelations[] = [];
  let handlersBlockedSchedulesFormatted: ScheduleBlockWithRelations[];

  if (user.user.role !== "staff") {
    const data = await getSchedules({ all: true });
    allBlockedSchedules =
      data
        ?.map((day) => ({
          ...day,
          date: new Date(day.date),
          timeRanges: JSON.parse(day.timeRanges as string) as string[],
        }))
        .sort((a, b) => compareAsc(a.date, b.date)) ?? [];
    handlersBlockedSchedulesFormatted = allBlockedSchedules.filter(
      (day) => day.handlerID === user.user?.id
    );
  } else {
    const handlersBlockedSchedules = await getSchedules({
      handlerId: user.user.id,
    });
    handlersBlockedSchedulesFormatted =
      handlersBlockedSchedules
        ?.map((day) => ({
          ...day,
          date: new Date(day.date),
          timeRanges: JSON.parse(day.timeRanges as string) as string[],
        }))
        .sort((a, b) => compareAsc(a.date, b.date)) ?? [];
  }

  // NOTE: We need `getBookings` to check for conflicts within that booking date. the data fetched is passed towards updatescheduleform component
  // #TODO optimize what data you just need here
  const bookings = await getBookings({
    handlerId: user.user.id,
    role: user.user.role,
    testRole: user.user.testRole,
    filters: {
      getPageCount: false,
      dateRange: {
        start: new Date().toISOString(),
        end: addDays(new Date(), 31).toISOString(),
      },
      id: user.user.id,
    },
  });

  return (
    <ScheduleClient
      blockedSchedules={handlersBlockedSchedulesFormatted}
      bookings={bookings.data}
      allBlockedSchedules={allBlockedSchedules}
    />
  );
}

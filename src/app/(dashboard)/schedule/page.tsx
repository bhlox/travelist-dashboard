import { getSchedules } from "@/lib/actions/schedule";
import ScheduleClient from "./client";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { ScheduleBlockData } from "@/lib/types";
import { getBookings } from "@/lib/actions/bookings";

export default async function SchedulePage() {
  const user = await getUser();
  if (!user || !user.user) {
    redirect("/login");
  }
  const blockedSchedules = await getSchedules({ handlerId: user.user.id });
  const mappedData: ScheduleBlockData[] = blockedSchedules.map((day) => ({
    ...day,
    date: new Date(day.date),
    timeRanges: JSON.parse(day.timeRanges as string) as string[],
  }));

  // #TODO optimize what data you just need here
  const bookings = await getBookings({
    handlerId: user.user.id,
    role: user.user.role,
    testRole: user.user.testRole,
  });

  return <ScheduleClient blockedSchedules={mappedData} bookings={bookings} />;
}

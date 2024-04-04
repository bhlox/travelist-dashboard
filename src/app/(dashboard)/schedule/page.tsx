import { getSchedules } from "@/lib/actions/schedule";
import ScheduleClient from "./client";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { ScheduleBlockData } from "@/lib/types";

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
  return <ScheduleClient blockedSchedules={mappedData} />;
}

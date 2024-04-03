import { getSchedules } from "@/lib/actions/schedule";
import ScheduleClient from "./client";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { ScheduleBlockData } from "@/lib/types";

export default async function SchedulePage() {
  const blockedSchedules = await getSchedules({ all: true });
  const mappedData: ScheduleBlockData[] = blockedSchedules.map((day) => ({
    ...day,
    date: new Date(day.date),
    timeRanges: JSON.parse(day.timeRanges as string) as string[],
  }));
  return <ScheduleClient blockedSchedules={mappedData} />;
}

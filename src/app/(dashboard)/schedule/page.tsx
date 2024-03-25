import { getSchedules } from "@/lib/actions/schedule";
import ScheduleClient from "./client";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function SchedulePage() {
  const blockedSchedules = await getSchedules({ all: true });
  const mappedData = blockedSchedules.map((day) => ({
    date: new Date(day.date),
    timeRanges: JSON.parse(day.timeRanges as string),
    type: day.type,
    id: day.id,
  }));
  return <ScheduleClient blockedSchedules={mappedData} />;
}

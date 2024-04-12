import React from "react";
import ClientApprovalIdPage from "./client";
import { getSchedule } from "@/lib/actions/schedule";

export default async function ScheduleApprovalIdPage({
  params,
}: {
  params: { id: string };
}) {
  const blockedSchedule = await getSchedule(+params.id);
  if (!blockedSchedule) {
    throw new Error("Schedule not found");
  }
  const mappedData = {
    ...blockedSchedule,
    date: new Date(blockedSchedule.date),
    timeRanges: JSON.parse(blockedSchedule.timeRanges as string) as string[],
  };

  return <ClientApprovalIdPage blockedSchedule={mappedData} />;
}

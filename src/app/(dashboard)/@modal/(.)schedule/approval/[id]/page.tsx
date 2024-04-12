import React from "react";
import ModalClientScheduleApprovalIdPage from "./client";
import { getSchedule } from "@/lib/actions/schedule";

export default async function ModalScheduleApprovalIdPage({
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

  return <ModalClientScheduleApprovalIdPage blockedSchedule={mappedData} />;
}

import UpdateScheduleForm from "@/components/forms/update schedule";
import { ScheduleBlockInfo } from "@/lib/types";
import React from "react";

export default function EditBlockScheduleClient({
  blockedSchedules,
  editId,
  toBeEditedBlockedSchedule,
}: {
  blockedSchedules: ScheduleBlockInfo[];
  editId: string;
  toBeEditedBlockedSchedule: ScheduleBlockInfo;
}) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl md:text-4xl font-bold text-center">
        Edit this blocked schedule
      </h3>
      <UpdateScheduleForm
        toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
        blockedSchedules={blockedSchedules}
        submitType="update"
        editId={editId}
        isModal={false}
      />
    </div>
  );
}

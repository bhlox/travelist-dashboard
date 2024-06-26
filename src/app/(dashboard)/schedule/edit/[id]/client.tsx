import UpdateScheduleForm from "@/components/forms/update schedule";
import { ScheduleBlockData, SelectBooking } from "@/lib/types";
import React from "react";

export default function EditBlockScheduleClient({
  blockedSchedules,
  editId,
  toBeEditedBlockedSchedule,
  bookings,
}: {
  blockedSchedules: ScheduleBlockData[];
  editId: string;
  toBeEditedBlockedSchedule: ScheduleBlockData;
  bookings: SelectBooking[];
}) {
  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h3 className="text-2xl md:text-4xl font-bold text-center">
        Edit this blocked schedule
      </h3>
      <UpdateScheduleForm
        toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
        blockedSchedules={blockedSchedules}
        submitType="update"
        editId={editId}
        isModal={false}
        bookings={bookings}
      />
    </div>
  );
}

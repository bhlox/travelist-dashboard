"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ScheduleBlockData, SelectBooking } from "@/lib/types";
import UpdateScheduleForm from "@/components/forms/update schedule";

export default function ModalEditingBlockedSchedule({
  blockedSchedules,
  toBeEditedBlockedSchedule,
  editId,bookings
}: {
  blockedSchedules: ScheduleBlockData[];
  toBeEditedBlockedSchedule: ScheduleBlockData;
  editId: string;
  bookings: SelectBooking[];
}) {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent
        onInteractOutside={(e) => {
          // if(e.detail.originalEvent.button)
          return e.preventDefault();
        }}
        className="sm:max-w-md w-11/12 rounded-lg"
      >
        <DialogHeader>
          {/* <DialogTitle>Update your blocked schedule </DialogTitle> */}
        </DialogHeader>
        <UpdateScheduleForm
          blockedSchedules={blockedSchedules}
          submitType="update"
          toBeEditedBlockedSchedule={toBeEditedBlockedSchedule}
          editId={editId}
          isModal
          bookings={bookings}
        />
      </DialogContent>
    </Dialog>
  );
}

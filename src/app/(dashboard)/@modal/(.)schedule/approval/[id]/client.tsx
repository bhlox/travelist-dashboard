"use client";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import ToastContent from "@/components/toast/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateBlockedSchedule } from "@/lib/actions/schedule";
import { ScheduleBlockData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function ModalClientScheduleApprovalIdPage({
  blockedSchedule,
}: {
  blockedSchedule: ScheduleBlockData & { handler: { displayname: string } };
}) {
  const { id } = useUserDetailsContext();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: boolean) =>
      updateBlockedSchedule({
        id: blockedSchedule.id,
        approved: value,
        statusUpdatedBy: id,
      }),
    onSuccess: (data: any, value: boolean) => {
      const msg = value ? "approved" : "rejected";
      toast.success(
        <ToastContent
          title="Approval status updated"
          description={`${blockedSchedule.handler.displayname} schedule has been ${msg}`}
        />
      );
    },
    onError: () => {
      toast.error(
        <ToastContent
          title="Approval status update failed"
          description="An error occurred while updating approval status"
        />
      );
    },
    onSettled: () => {
      router.back();
    },
  });

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
          <DialogTitle>Update approval status</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You are about to update approval status for{" "}
          <span className="text-lg font-medium">
            {blockedSchedule.handler.displayname}
          </span>
        </DialogDescription>
        <div className="grid grid-cols-2 gap-6">
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={() => mutate(false)}
          >
            Deny
          </Button>
          <Button disabled={isPending} onClick={() => mutate(true)}>
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

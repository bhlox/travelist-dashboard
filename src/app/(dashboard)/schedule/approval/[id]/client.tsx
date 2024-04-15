"use client";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import LoadingSpinner from "@/components/svg/loader";
import ToastContent from "@/components/toast/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingsForDate } from "@/lib/actions/bookings";
import { updateBlockedSchedule } from "@/lib/actions/schedule";
import {
  ScheduleBlockData,
  ScheduleBlockWithRelations,
  SelectBlockedSchedule,
} from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isSameDay, lightFormat } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function ClientApprovalIdPage({
  blockedSchedule,
}: {
  blockedSchedule: ScheduleBlockWithRelations;
}) {
  console.log(blockedSchedule);
  const { id } = useUserDetailsContext();
  const router = useRouter();

  const { data, isFetching, isError } = useQuery({
    queryKey: ["customers", blockedSchedule.date],
    queryFn: () =>
      getBookingsForDate({
        date: lightFormat(blockedSchedule.date, "yyyy-MM-dd"),
        handlerId: blockedSchedule.handlerID,
      }),
    staleTime: Infinity,
  });

  const conflictList =
    data?.filter((cust) => {
      if (blockedSchedule.type === "day") {
        return isSameDay(cust.selectedDate, blockedSchedule.date);
      } else {
        return (
          isSameDay(cust.selectedDate, blockedSchedule.date) &&
          blockedSchedule.timeRanges.some(
            (time) => time === cust.selectedTime.slice(0, 5)
          )
        );
      }
    }) || [];

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
    <div className="py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Update Approve Schedule Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="space-y-2">
              <h4 className="text-2xl md:text-4xl font-bold">Details:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Day: {lightFormat(blockedSchedule.date, "yyyy-MM-dd")}</li>
                <li>Schedule Block Type: {blockedSchedule.type}</li>
                {blockedSchedule.timeRanges && (
                  <li>
                    Time: {blockedSchedule.timeRanges[0]} -{" "}
                    {blockedSchedule.timeRanges.at(-1)}
                  </li>
                )}
                <li>Handler: {blockedSchedule.handler.displayname}</li>
                {blockedSchedule.statusUpdatedBy && (
                  <>
                    <li>
                      Status: {blockedSchedule.approved ? "Approved" : "Denied"}
                    </li>
                    <li>
                      Status Updated By: {blockedSchedule.approver?.displayname}
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl md:text-4xl font-bold ">Conflicts:</h4>
              {conflictList.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {conflictList.map((con) => (
                    <li key={`conflict-${con.id}`}>
                      <Link
                        href={`/customers/${con.id}`}
                        className="underline underline-offset-2 hover:text-blue-500"
                      >
                        {con.customerName} - {con.selectedTime.slice(0, 5)}{" "}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : !isFetching ? (
                <p>No Conflicts</p>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}

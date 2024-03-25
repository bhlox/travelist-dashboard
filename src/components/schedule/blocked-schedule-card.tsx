"use client";
import React, { useEffect, useState } from "react";
import { format, compareAsc, lightFormat, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteSchedule } from "@/lib/actions/schedule";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ToastContent from "@/components/toast/content";
import LoadingSpinner from "@/components/svg/loader";
import Link from "next/link";
import { ScheduleBlockInfo } from "@/lib/types";
import { getCustomersForDate } from "@/lib/actions/customers";


export default function BlockedScheduleCard({
  blockedSchedule,
  setConflictsDetected,
}: {
  blockedSchedule: { id: number } & ScheduleBlockInfo;
  setConflictsDetected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const formattedDate = format(blockedSchedule.date, "MMMM dd, yyyy");
  const formattedTimeRange =
    blockedSchedule.type === "time"
      ? `From ${blockedSchedule.timeRanges[0]} to 
    ${blockedSchedule.timeRanges.at(-1)}`
      : "";

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSchedule(blockedSchedule.id),
    onSuccess: () => {
      toast.success(
        <ToastContent
          title="Schedule deleted"
          description={`${formattedDate} ${formattedTimeRange}`}
        />
      );
    },
  });

  const { data, isFetching, isError } = useQuery({
    queryKey: ["customers", blockedSchedule.date],
    queryFn: () =>
      getCustomersForDate(lightFormat(blockedSchedule.date, "yyyy-MM-dd")),
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

  useEffect(() => {
    if (conflictList?.length > 0) {
      setConflictsDetected(true);
    }
  }, [conflictList?.length, setConflictsDetected]);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{formattedDate}</CardTitle>
          {blockedSchedule.type === "time" ? (
            <CardDescription>{formattedTimeRange}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Can edit or add description here.</p>

          <div>
            <h4>Conflicts</h4>

            {isFetching ? (
              <p>Loading...</p>
            ) : isError ? (
              <p>Error</p>
            ) : conflictList?.length > 0 ? (
              <>
                <ul className="list-disc list-inside flex flex-col">
                  {conflictList?.map((cust) => (
                    <Link
                      href={`/customers/${cust.id}`}
                      key={`conflict-${cust.id}`}
                      className="inline-block"
                    >
                      <li>
                        {cust.customerName} - booked at {cust.selectedTime}
                      </li>
                    </Link>
                  ))}
                </ul>
              </>
            ) : (
              <p>No conflicts</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={() => mutate()}
            className={cn(null, null, {
              "w-32": isPending,
            })}
          >
            {isPending ? <LoadingSpinner /> : "Cancel schedule"}
          </Button>
          <Button disabled={isPending} asChild>
            <Link scroll={false} href={`/schedule/edit/${blockedSchedule.id}`}>
              Edit Schedule
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


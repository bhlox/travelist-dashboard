"use client";
import React, { useEffect, useState } from "react";
import { format, compareAsc, lightFormat, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ScheduleBlockData } from "@/lib/types";
import { getBookingsForDate } from "@/lib/actions/bookings";
import { Separator } from "../ui/separator";
import { MdEditSquare } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import DialogDeleteConfirmation from "../dialog/delete-confirmation";
import { deleteSchedule } from "@/lib/actions/schedule";

export default function BlockedScheduleCard({
  blockedSchedule,
  setConflictsDetected,
}: {
  blockedSchedule: ScheduleBlockData;
  setConflictsDetected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const formattedDate = format(blockedSchedule.date, "MMMM dd, yyyy");
  const formattedTimeRange =
    blockedSchedule.type === "time"
      ? `From ${blockedSchedule.timeRanges[0]} to 
    ${blockedSchedule.timeRanges.at(-1)}`
      : "";


  const { data, isFetching, isError } = useQuery({
    queryKey: ["customers", blockedSchedule.date],
    queryFn: () =>
      getBookingsForDate({
        date: lightFormat(blockedSchedule.date, "yyyy-MM-dd"),
        handlerId: blockedSchedule.personnel,
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

  useEffect(() => {
    if (conflictList?.length > 0) {
      setConflictsDetected(true);
    }
  }, [conflictList?.length, setConflictsDetected]);

  return (
    <>
      <div className="p-4">
        <Card className="2xl:max-w-[324px] h-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
              {formattedDate}
              <button
                onClick={() => setDeleteDialog(true)}
                className="inline text-base hover:scale-110 transition-transform duration-200 ease-in-out"
              >
                <FaTrash />
              </button>
            </CardTitle>
            {blockedSchedule.type === "time" ? (
              <CardDescription>{formattedTimeRange}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm whitespace-pre-wrap">
              {blockedSchedule.comment || "No comment"}
            </p>

            <Separator />
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
                        href={`/bookings/${cust.id}`}
                        key={`conflict-${cust.id}`}
                        className="inline-block text-blue-800 dark:text-blue-400 hover:opacity-80 underline max-w-max underline-offset-4"
                      >
                        <li>
                          {cust.customerName} - {cust.selectedTime.slice(0, 5)}
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
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full text-center flex gap-2 items-center bg-yellow-700 "
              asChild
            >
              <Link
                scroll={false}
                href={`/schedule/edit/${blockedSchedule.id}`}
              >
                <MdEditSquare className="text-lg" /> Edit Schedule
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      {deleteDialog && (
        <DialogDeleteConfirmation
          deleteFn={deleteSchedule}
          dialogDescription={`You are about to delete this blocked schedule (${formattedDate} ${formattedTimeRange})`}
          dialogTitle="Confirm Schedule Block deletion"
          idToBeDeleted={blockedSchedule.id}
          errorMsg="Failed to delete schedule"
          sucessMsg={{
            title: "Schedule deleted",
            description: `${formattedDate} ${formattedTimeRange}`,
          }}
          setDeleteDialog={setDeleteDialog}
        />
      )}
    </>
  );
}

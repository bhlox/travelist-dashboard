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
import { ScheduleBlockData, ScheduleBlockWithRelations } from "@/lib/types";
import { getBookingsForDate } from "@/lib/actions/bookings";
import { Separator } from "../ui/separator";
import { MdEditSquare } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import DialogDeleteConfirmation from "../dialog/delete-confirmation";
import { deleteSchedule } from "@/lib/actions/schedule";
import { PiWarningFill } from "react-icons/pi";
import { GrLike } from "react-icons/gr";

export default function ApprovedBlockedScheduleCard({
  blockedSchedule,
}: {
  blockedSchedule: ScheduleBlockWithRelations;
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

  return (
    <>
      <div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <Link
                href={`/bookings?date=${lightFormat(
                  blockedSchedule.date,
                  "yyyy-MM-dd"
                )}`}
                className="underline underline-offset-4 hover:text-blue-500"
              >
                {formattedDate}{" "}
              </Link>
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
            <blockquote className="p-4 my-4 border-s-4 border-gray-400 bg-gray-300 dark:border-gray-500 dark:bg-neutral-900">
              <p className="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
                &quot;{blockedSchedule.comment || "No comment"}&quot;
              </p>
            </blockquote>

            <p className="font-light text-neutral-500 dark:text-neutral-400">
              Approved by:{" "}
              <span className="italic">
                {blockedSchedule.approver?.displayname}
              </span>
            </p>

            <Separator />
            <div className="space-y-4">
              {conflictList.length ? (
                <h4 className="text-lg lg:text-xl font-semibold text-red-600 dark:text-red-500 flex items-center gap-2">
                  <PiWarningFill className="text-yellow-500 text-2xl lg:text-3xl" />{" "}
                  Conflicts
                </h4>
              ) : (
                <h4 className="text-lg lg:text-xl font-semibold flex items-center gap-2">
                  <GrLike className="dark:text-green-500 text-emerald-800" /> No
                  conflicts
                </h4>
              )}
              {isFetching ? (
                <p>Loading...</p>
              ) : isError ? (
                <p>Error</p>
              ) : conflictList.length ? (
                <>
                  <ul className="list-disc list-inside flex flex-col space-y-2">
                    {conflictList?.map((cust) => (
                      <Link
                        href={`/bookings/${cust.id}`}
                        key={`conflict-${cust.id}`}
                        className="inline-block hover:text-blue-500 underline max-w-max underline-offset-4"
                      >
                        <li>
                          {cust.customerName} - {cust.selectedTime.slice(0, 5)}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full text-center flex gap-2 items-center bg-yellow-700"
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

"use client";
import React, { useState } from "react";
import { isSameDay, lightFormat } from "date-fns";
import UpdateScheduleForm from "@/components/forms/update schedule";
import ApprovedBlockedScheduleCard from "@/components/schedule/blocked-schedule-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ScheduleBlockData,
  ScheduleBlockWithRelations,
  SelectBooking,
} from "@/lib/types";
import Headings from "@/components/ui/headings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { getBookingsForDate } from "@/lib/actions/bookings";
import Link from "next/link";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";

export default function ScheduleClient({
  blockedSchedules,
  bookings,
  allBlockedSchedules,
}: {
  blockedSchedules: ScheduleBlockWithRelations[];
  bookings: SelectBooking[];
  allBlockedSchedules: ScheduleBlockWithRelations[];
}) {
  const { role } = useUserDetailsContext();
  const userApprovedSchedules = blockedSchedules.filter(
    (schedule) => schedule.approved
  );
  const userPendingSchedules = blockedSchedules.filter(
    (schedule) => !schedule.approved
  );

  const pendingSchedules = allBlockedSchedules.filter(
    (schedule) => !schedule.statusUpdatedBy
  );

  const updatedBlockedScheduleApprovals = allBlockedSchedules.filter(
    (sched) => sched.statusUpdatedBy
  );
  return (
    <>
      <Headings
        title="Schedule"
        description="Update and manage your schedule"
      />
      <div className="space-y-6">
        <div className="grid place-items-center lg:place-items-start lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-12 mt-8">
          <UpdateScheduleSection
            blockedSchedules={blockedSchedules}
            bookings={bookings}
          />
          {blockedSchedules.length ? (
            <BlockedScheduleSection blockedSchedules={userApprovedSchedules} />
          ) : (
            <h4 className="text-2xl md:text-4xl font-bold lg:col-span-2">
              No blocked schedule(s) yet approved
            </h4>
          )}
        </div>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-12 ">
          <PendingSchedulesSection
            pendingSchedules={
              role === "staff" ? userPendingSchedules : pendingSchedules
            }
          />
          {role !== "staff" && (
            <UpdatedBlockedSchedulesSection
              approvedSchedules={updatedBlockedScheduleApprovals}
            />
          )}
        </div>
      </div>
    </>
  );
}

function UpdateScheduleSection({
  blockedSchedules,
  bookings,
}: {
  blockedSchedules: ScheduleBlockData[];
  bookings: SelectBooking[];
}) {
  return (
    <section className="max-w-[650px] lg:max-w-screen-2xl w-full">
      <UpdateScheduleForm
        blockedSchedules={blockedSchedules}
        submitType="create"
        bookings={bookings}
      />
    </section>
  );
}

function BlockedScheduleSection({
  blockedSchedules,
}: {
  blockedSchedules: ScheduleBlockWithRelations[];
}) {
  return (
    <section className="w-full max-w-[650px] lg:max-w-screen-2xl space-y-4 xl:col-span-2">
      <h2 className="text-4xl font-bold text-balance text-center lg:text-left">
        Upcoming blocked schedule
      </h2>
      {blockedSchedules.length ? (
        <div className="grid 2xl:grid-cols-2 gap-4">
          {blockedSchedules.map((sched) => (
            <ApprovedBlockedScheduleCard
              key={`blocked-schedule-${sched.id}`}
              blockedSchedule={sched}
            />
          ))}
        </div>
      ) : (
        <p className="text-lg md:text-xl font-light">
          No approved schedule(s) yet
        </p>
      )}
      {/* {conflictsDetected ? <ConflictAlert /> : null} */}
    </section>
  );
}

function ConflictAlert() {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            You have conflicting schedules with your customers
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <span className="block">
              Please adjust the necessary timeslots or inform your customers
              that you are not available.
            </span>

            <span className="flex justify-center w-full">
              <Button type="button" onClick={() => setOpen(false)}>
                Okay
              </Button>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function PendingSchedulesSection({
  pendingSchedules,
}: {
  pendingSchedules: ScheduleBlockWithRelations[];
}) {
  const { role } = useUserDetailsContext();
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">
            {role === "staff"
              ? "My pending blocked schedule approvals"
              : "Pending Blocked Schedule Approvals"}{" "}
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {pendingSchedules.length ? (
              pendingSchedules.map((schedule, i) => (
                <PendingScheduleAccordionItem
                  key={`pending-schedule-${schedule.id}`}
                  schedule={schedule}
                  i={i}
                />
              ))
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">
                No pending approval(s) submitted
              </p>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}

function PendingScheduleAccordionItem({
  schedule,
  i,
}: {
  schedule: ScheduleBlockWithRelations;
  i: number;
}) {
  const { id, role } = useUserDetailsContext();
  const { data, isFetching, isError } = useQuery({
    queryKey: ["customers", schedule.date],
    queryFn: () =>
      getBookingsForDate({
        date: lightFormat(schedule.date, "yyyy-MM-dd"),
        handlerId: schedule.personnel,
      }),
    staleTime: Infinity,
  });

  const conflictList =
    data?.filter((cust) => {
      if (schedule.type === "day") {
        return isSameDay(cust.selectedDate, schedule.date);
      } else {
        return (
          isSameDay(cust.selectedDate, schedule.date) &&
          schedule.timeRanges.some(
            (time) => time === cust.selectedTime.slice(0, 5)
          )
        );
      }
    }) || [];
  return (
    <AccordionItem
      value={`item-${i + 1}`}
      className="border-b-2 border-black dark:border-gray-100"
    >
      <AccordionTrigger>
        {role !== "staff" && <>Personnel: {schedule.handler.displayname}, </>}
        Date: {lightFormat(schedule.date, "yyyy-MM-dd")}
      </AccordionTrigger>
      <AccordionContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6 px-8">
          <div>
            <h4 className="text-lg lg:text-xl font-semibold">Details:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Blocked Schedule Type: {schedule.type}</li>
              {schedule.type === "time" && (
                <li>
                  Time: {schedule.timeRanges[0]} - {schedule.timeRanges.at(-1)}
                </li>
              )}
              <li>Comment: {schedule.comment || "No comment was written"}</li>
              {schedule.statusUpdatedBy && (
                <>
                  <li>Status: {schedule.approved ? "approved" : "denied"}</li>
                  <li>Approved by: {schedule.approver?.displayname}</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg lg:text-xl font-semibold">Conflicts:</h4>
            {!isFetching && conflictList.length ? (
              <ul className="list-disc list-inside space-y-1">
                {conflictList.map((con) => (
                  <li key={`accordion-conflict-${con.id}`}>
                    <Link
                      href={`/bookings/${con.id}`}
                      className="underline underline-offset-2 hover:text-blue-500"
                    >
                      {con.customerName} - {con.selectedTime.slice(0, 5)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>no conflicts detected</p>
            )}
          </div>
        </div>
        <div>
          {role === "staff" || id === schedule.personnel ? (
            <Button className="w-full" asChild>
              <Link scroll={false} href={`/schedule/edit/${schedule.id}`}>
                Edit Schedule
              </Link>
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link scroll={false} href={`/schedule/approval/${schedule.id}`}>
                Update Approval
              </Link>
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function UpdatedBlockedSchedulesSection({
  approvedSchedules,
}: {
  approvedSchedules: ScheduleBlockWithRelations[];
}) {
  const approvedStatusesSchedules = approvedSchedules.filter(
    (schedule) => schedule.approved
  );
  const deniedStatusesSchedules = approvedSchedules.filter(
    (schedule) => !schedule.approved
  );
  return (
    <section className="xl:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Updated Blocked Schedules Approvals</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="grid gap-16 md:grid-cols-2">
          <div className="">
            <h4 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-500">
              Denied
            </h4>
            {deniedStatusesSchedules.length ? (
              <Accordion type="single" collapsible>
                {deniedStatusesSchedules.map((schedule, i) => (
                  <PendingScheduleAccordionItem
                    key={`pending-schedule-${schedule.id}`}
                    schedule={schedule}
                    i={i}
                  />
                ))}
              </Accordion>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">
                No Denied Schedules
              </p>
            )}
          </div>
          <div className="">
            <h4 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-500">
              Approved
            </h4>
            {approvedStatusesSchedules.length ? (
              <Accordion type="single" collapsible>
                {approvedStatusesSchedules.map((schedule, i) => (
                  <PendingScheduleAccordionItem
                    key={`pending-schedule-${schedule.id}`}
                    schedule={schedule}
                    i={i}
                  />
                ))}
              </Accordion>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">
                No Approved Schedules
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

"use client";
import React, { useState } from "react";
import { compareAsc } from "date-fns";
import UpdateScheduleForm from "@/components/forms/update schedule";
import BlockedScheduleCard from "@/components/schedule/blocked-schedule-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScheduleBlockData } from "@/lib/types";
import Headings from "@/components/ui/headings";

// #TODO add admin level actions for this page. current UI is only setup for staff level auth role. as for any level other level, a search bar input or select input or will display the all staff level. once pick,the blockschedulesection component will then be rendered. no actions can be done to the blocked schedule though.

export default function ScheduleClient({
  blockedSchedules,
}: {
  blockedSchedules: ScheduleBlockData[];
}) {
  return (
    <>
      <Headings
        title="Schedule"
        description={"Update and manage your schedule"}
      />
      <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start lg:flex-row gap-4 mt-8">
        <UpdateScheduleSection blockedSchedules={blockedSchedules} />
        {blockedSchedules.length > 0 ? (
          <BlockedScheduleSection blockedSchedules={blockedSchedules} />
        ) : (
          <h4>No blocked schedule yet made</h4>
        )}
      </div>
    </>
  );
}

function UpdateScheduleSection({
  blockedSchedules,
}: {
  blockedSchedules: ScheduleBlockData[];
}) {
  return (
    <section className="max-w-[650px] lg:max-w-[500px] w-full">
      <UpdateScheduleForm
        blockedSchedules={blockedSchedules}
        submitType="create"
      />
    </section>
  );
}

function BlockedScheduleSection({
  blockedSchedules,
}: {
  blockedSchedules: ScheduleBlockData[];
}) {
  const [conflictsDetected, setConflictsDetected] = useState(false);
  const sortedDates = blockedSchedules.sort((a, b) =>
    compareAsc(a.date, b.date)
  );

  return (
    <section className="w-full max-w-[650px] lg:w-auto lg:max-w-full">
      <h2 className="text-2xl lg:text-4xl font-bold spacey-y-6 text-balance text-center lg:text-left lg:pl-6">
        Upcoming blocked schedule
      </h2>
      <div className="2xl:grid 2xl:grid-cols-2">
        {sortedDates.map((sched) => (
          <BlockedScheduleCard
            key={`blocked-schedule-${sched.id}`}
            blockedSchedule={sched}
            setConflictsDetected={setConflictsDetected}
          />
        ))}
      </div>
      {conflictsDetected ? <ConflictAlert /> : null}
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

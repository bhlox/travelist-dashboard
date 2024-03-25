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
import { ScheduleBlockInfoWithId } from "@/lib/types";

export default function ScheduleClient({
  blockedSchedules,
}: {
  blockedSchedules: ScheduleBlockInfoWithId[];
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 ">
      <UpdateScheduleSection blockedSchedules={blockedSchedules} />
      {blockedSchedules.length > 0 ? (
        <BlockedScheduleSection blockedSchedules={blockedSchedules} />
      ) : (
        <h4>No blocked schedule yet made</h4>
      )}
    </div>
  );
}

function UpdateScheduleSection({
  blockedSchedules,
}: {
  blockedSchedules: {
    date: Date;
    timeRanges: any;
    type: "day" | "time";
  }[];
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-2xl md:text-4xl font-bold">Update Schedule</h3>
        <p>Block the time or days where you are not available</p>
      </div>
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
  blockedSchedules: ScheduleBlockInfoWithId[];
}) {
  const [conflictsDetected, setConflictsDetected] = useState(false);
  const sortedDates = blockedSchedules.sort((a, b) =>
    compareAsc(a.date, b.date)
  );

  return (
    <section>
      <h2 className="text-2xl md:text-4xl font-bold spacey-y-6">
        Your upcoming blocked schedule
      </h2>
      {sortedDates.map((sched) => (
        <BlockedScheduleCard
          key={`blocked-schedule-${sched.date}`}
          blockedSchedule={sched}
          setConflictsDetected={setConflictsDetected}
        />
      ))}
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
            <p>
              Please adjust the necessary timeslots or inform your customers
              that you are not available.
            </p>

            <div className="flex justify-center">
              <Button type="button" onClick={() => setOpen(false)}>
                Okay
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateAfter, DateBefore, DayOfWeek, Matcher } from "react-day-picker";
import {
  addDays,
  eachHourOfInterval,
  lightFormat,
  format,
  isSameDay,
  compareAsc,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBlockedSchedule,
  deleteSchedule,
  getSchedules,
} from "@/lib/actions/schedule";
import { toast } from "react-toastify";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
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

export default function ScheduleClient({
  blockedSchedules,
}: {
  blockedSchedules: {
    date: Date;
    timeRanges: any;
    type: "day" | "time";
    id: number;
  }[];
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
      <UpdateScheduleForm blockedSchedules={blockedSchedules} />
    </section>
  );
}

const result = eachHourOfInterval({
  start: new Date(2014, 9, 6, 9),
  end: new Date(2014, 9, 6, 18),
});
const openingHours = result.map((dt) => lightFormat(dt, "HH:mm"));

function UpdateScheduleForm({
  blockedSchedules,
}: {
  blockedSchedules: {
    date: Date;
    timeRanges: any;
    type: "day" | "time";
  }[];
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { username } = useUserDetailsContext();
  const dateSchema = z.object({
    selectedDate: z.date({
      required_error: "A date of birth is required.",
    }),
  });
  const timeSchema = z.object({
    selectedDate: z.date({
      required_error: "A date of birth is required.",
    }),
    startTime: z.string().refine((time) => openingHours.includes(time), {
      message: "Start time must be within opening hours.",
    }),
    endTime: z.string().refine((time) => openingHours.includes(time), {
      message: "End time must be within opening hours.",
    }),
  });
  const [selectedFormSchema, setSelectedFormSchema] = useState<{
    schema: typeof dateSchema | typeof timeSchema;
    blockType: "time" | "day";
  }>({ blockType: "day", schema: dateSchema });

  const form = useForm<z.infer<typeof selectedFormSchema.schema>>({
    resolver: zodResolver(selectedFormSchema.schema),
  });

  const startTimeValue = form.watch("startTime")?.slice(0, 2);
  const endTimeValue = form.watch("endTime")?.slice(0, 2);

  const onSubmit = async (data: z.infer<typeof selectedFormSchema.schema>) => {
    if (+endTimeValue - +startTimeValue <= 0) {
      return form.setError("endTime", {
        message: "End time must be after start time.",
        type: "pattern",
      });
    }
    const formattedDate = lightFormat(data.selectedDate, "yyyy-MM-dd");
    if (startTimeValue && startTimeValue) {
      const timeIntervals = eachHourOfInterval({
        start: new Date(`${formattedDate}T${startTimeValue}:00`),
        end: new Date(`${formattedDate}T${endTimeValue}:00`),
      });
      const timeRanges = timeIntervals.map((int) => lightFormat(int, "HH:mm"));
      await createBlockedSchedule({
        date: formattedDate,
        timeRanges: JSON.stringify(timeRanges),
        type: selectedFormSchema.blockType,
        personnel: username,
      });
      return toast.success("Schedule Updated");
    }
    await createBlockedSchedule({
      date: formattedDate,
      type: selectedFormSchema.blockType,
      personnel: username,
    });
    return toast.success("Schedule Updated");
  };

  const disableWeekends: Matcher = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };
  //   const disableDays: Matcher = [new Date(2024, 2, 26), new Date(2024, 2, 28)];
  const disableDays = blockedSchedules
    .filter((day) => day.type === "day")
    .map((day) => new Date(day.date));
  const beforeTomorrow: DateBefore = { before: new Date() };
  const after31Days: DateAfter = { after: addDays(new Date(), 31) };

  // const disabledTimes = ["12:00", "15:00"];
  const disabledTimes = blockedSchedules
    .filter((date) => {
      if (isSameDay(form.getValues("selectedDate"), date.date)) {
        return date;
      }
    })
    .flatMap((time) => time.timeRanges)
    .slice(0, -1);

  // const {
  //   data: disabledTimes,
  //   error,
  //   isFetching,
  // } = useQuery({
  //   queryKey: [
  //     "time",
  //     selectedFormSchema.blockType,
  //     form.getValues("selectedDate"),
  //   ],
  //   queryFn: async () => {
  //     const data = await getSchedules({ username, isTime: true });
  //     //   const mappedDays = data.map((day) => new Date(day.date));
  //     //   console.log({ mappedDays });
  //     //   disableDays = mappedDays;
  //     form.setValue("startTime", "");
  //     form.setValue("endTime", "");
  //     form.clearErrors("endTime");
  //     const mappedTimes = data.map((day) =>
  //       JSON.parse(day.timeRanges as string)
  //     );
  //     const mappedData = mappedTimes.flat();
  //     return mappedData;
  //   },
  //   enabled: selectedFormSchema.blockType === "time",
  // });

  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <Button
          type="button"
          onClick={() =>
            setSelectedFormSchema({ schema: dateSchema, blockType: "day" })
          }
        >
          Day
        </Button>
        <Button
          type="button"
          onClick={() =>
            setSelectedFormSchema({ schema: timeSchema, blockType: "time" })
          }
        >
          w/ time
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="selectedDate"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        disabled={[
                          disableWeekends,
                          ...disableDays,
                          beforeTomorrow,
                          after31Days,
                        ]}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {/* Your date of birth is used to calculate your age. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="startTime"
              disabled={selectedFormSchema.blockType === "day"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={selectedFormSchema.blockType === "day"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a starting time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {openingHours.map((hr) => (
                        <SelectItem
                          key={`hr-${hr}`}
                          value={hr}
                          disabled={
                            disabledTimes ? disabledTimes.includes(hr) : true
                          }
                        >
                          {hr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              disabled={
                selectedFormSchema.blockType === "day" ||
                !form.getValues("startTime")
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Until</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      selectedFormSchema.blockType === "day" ||
                      !form.getValues("startTime")
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a ending time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {openingHours.map((hr) => (
                        <SelectItem
                          key={`hr-${hr}`}
                          value={hr}
                          disabled={
                            disabledTimes ? disabledTimes.includes(hr) : true
                          }
                        >
                          {hr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

function BlockedScheduleSection({
  blockedSchedules,
}: {
  blockedSchedules: {
    date: Date;
    timeRanges: any;
    type: "day" | "time";
    id: number;
  }[];
}) {
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
        />
      ))}
    </section>
  );
}

function BlockedScheduleCard({
  blockedSchedule,
}: {
  blockedSchedule: {
    date: Date;
    timeRanges: any[];
    type: "day" | "time";
    id: number;
  };
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
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{formattedDate}</CardTitle>
          {blockedSchedule.type === "time" ? (
            <CardDescription>{formattedTimeRange}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <p>Can edit or add description here.</p>
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
            <Link href={`/schedule/edit/${blockedSchedule.id}`}>
              Edit Schedule
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { eachHourOfInterval, lightFormat, format, isSameDay } from "date-fns";
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
  updateBlockedSchedule,
} from "@/lib/actions/schedule";
import { toast } from "react-toastify";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import { useRouter } from "next/navigation";
import {
  after31Days,
  beforeTomorrow,
  disableWeekends,
  openingHours,
} from "@/lib/constants";
import { dateSchema, timeSchema } from "@/lib/forms-schema";
import { ScheduleBlockType, UpdateScheduleFormProps } from "@/lib/types";
import BtnsChangeFormShema from "./btns-change-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function UpdateScheduleForm({
  blockedSchedules,
  submitType,
  editId,
  toBeEditedBlockedSchedule,
  isModal,
}: UpdateScheduleFormProps) {
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { username } = useUserDetailsContext();

  const [selectedFormSchema, setSelectedFormSchema] = useState<{
    schema: typeof dateSchema | typeof timeSchema;
    blockType: ScheduleBlockType;
  }>(() => ({
    blockType: toBeEditedBlockedSchedule?.type ?? "day",
    schema:
      toBeEditedBlockedSchedule?.type === "time" ? timeSchema : dateSchema,
  }));

  const form = useForm<z.infer<typeof selectedFormSchema.schema>>({
    resolver: zodResolver(selectedFormSchema.schema),
    defaultValues:
      submitType === "update"
        ? {
            startTime:
              toBeEditedBlockedSchedule?.type === "time" &&
              selectedFormSchema.blockType === "time"
                ? toBeEditedBlockedSchedule?.timeRanges[0]
                : undefined,
            endTime:
              toBeEditedBlockedSchedule?.type === "time" &&
              selectedFormSchema.blockType === "time"
                ? toBeEditedBlockedSchedule?.timeRanges.at(-1)
                : undefined,
            selectedDate: toBeEditedBlockedSchedule?.date,
            comment: toBeEditedBlockedSchedule?.comment ?? undefined,
          }
        : {
            selectedDate: undefined,
            startTime: undefined,
            endTime: undefined,
            comment: undefined,
          },
  });

  const startTimeValue = form.watch("startTime")?.slice(0, 2) ?? "";
  const endTimeValue = form.watch("endTime")?.slice(0, 2) ?? "";
  const selectedDateValue = form.watch("selectedDate");

  const onSubmit = async (data: z.infer<typeof selectedFormSchema.schema>) => {
    if (startTimeValue.length > 0 && +endTimeValue - +startTimeValue <= 0) {
      return form.setError("endTime", {
        message: "End time must be after start time.",
        type: "pattern",
      });
    }
    const formattedDate = lightFormat(data.selectedDate, "yyyy-MM-dd");
    if (startTimeValue && endTimeValue) {
      const timeIntervals = eachHourOfInterval({
        start: new Date(`${formattedDate}T${startTimeValue}:00`),
        end: new Date(`${formattedDate}T${endTimeValue}:00`),
      });
      const timeRanges = timeIntervals.map((int) => lightFormat(int, "HH:mm"));
      if (submitType === "update") {
        await updateBlockedSchedule({
          date: formattedDate,
          timeRanges: JSON.stringify(timeRanges),
          type: selectedFormSchema.blockType,
          id: +editId!,
        });
        form.reset({
          selectedDate: undefined,
          startTime: "",
          endTime: "",
          comment: undefined,
        });
        toast.success("Schedule Updated");
        if (isModal) {
          return router.back();
        }
        return router.replace("/schedule");
      } else {
        await createBlockedSchedule({
          date: formattedDate,
          timeRanges: JSON.stringify(timeRanges),
          type: selectedFormSchema.blockType,
          personnel: username,
          comment: data.comment,
        });
      }
      form.reset({
        selectedDate: undefined,
        startTime: "",
        endTime: "",
        comment: undefined,
      });
      return toast.success("Schedule Updated");
    }
    if (submitType === "update") {
      await updateBlockedSchedule({
        date: formattedDate,
        timeRanges: null,
        type: selectedFormSchema.blockType,
        id: +editId!,
        comment: data.comment,
      });
      form.reset({
        selectedDate: undefined,
        startTime: "",
        endTime: "",
        comment: undefined,
      });
      toast.success("Schedule Updated");
      if (isModal) {
        return router.back();
      }
      return router.replace("/schedule");
    }
    await createBlockedSchedule({
      date: formattedDate,
      type: selectedFormSchema.blockType,
      personnel: username,
      comment: data.comment,
    });
    form.reset({
      selectedDate: undefined,
      startTime: "",
      endTime: "",
      comment: undefined,
    });
    return toast.success("Schedule Updated");
  };

  const disableDays = blockedSchedules
    .filter((day) =>
      selectedFormSchema.blockType === "time" ? day.type === "day" : day
    )
    .map((day) => new Date(day.date));

  const disabledTimes =
    toBeEditedBlockedSchedule &&
    isSameDay(selectedDateValue, toBeEditedBlockedSchedule?.date)
      ? []
      : blockedSchedules
          .filter((date) => {
            if (isSameDay(form.getValues("selectedDate"), date.date)) {
              return date;
            }
          })
          .flatMap((time) => time.timeRanges)
          .slice(0, -1);

  const handleChangeSchema = (blockType: ScheduleBlockType) => {
    if (blockType === "day") {
      setSelectedFormSchema({ schema: dateSchema, blockType: "day" });
    } else {
      setSelectedFormSchema({ schema: timeSchema, blockType: "time" });
    }
    form.reset({
      selectedDate: undefined,
      startTime: "",
      endTime: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Schedule</CardTitle>
        <CardDescription>
          Block the time or days where you are not available
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BtnsChangeFormShema
          blockType={selectedFormSchema.blockType}
          handleChangeSchema={handleChangeSchema}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="border-t pt-4"
          >
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
                              "pl-3 text-left font-normal",
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
                      <PopoverContent
                        className="w-auto p-0"
                        side="bottom"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                            form.resetField("startTime", {
                              defaultValue: "",
                            });
                            form.resetField("endTime", { defaultValue: "" });
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
                      key={`startTime-${field.value}`}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={selectedFormSchema.blockType === "day"}
                      value={field.value}
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
                      key={`endTime-${field.value}`}
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
            <FormField
              control={form.control}
              name="comment"
              defaultValue={toBeEditedBlockedSchedule?.comment ?? ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add a comment" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="block w-full mt-5" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

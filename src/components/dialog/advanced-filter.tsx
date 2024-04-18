import { Table } from "@tanstack/react-table";
import { useWindowSize } from "@uidotdev/usehooks";
import { format, lightFormat, toDate } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  BOOKING_STATUS_ADVANCE_OPTIONS,
  BOOKING_URL_QUERYPARAM_FILTERS,
} from "@/lib/constants";
import CustomPhoneInput from "@/components/ui/phone-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { advcanceSearchFormSchema } from "@/lib/forms-schema";
import MultipleSelector from "@/components/ui/multiple-selector";
import { BookingURLQueryParamFilters } from "@/lib/types";

export default function DialogAdvancedFilter<TData>({
  setShowAdvancedFilter,
  showAdvancedFilter,
  table,
}: {
  showAdvancedFilter: boolean;
  setShowAdvancedFilter: React.Dispatch<React.SetStateAction<boolean>>;
  table: Table<TData>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { width } = useWindowSize();
  const [disableBtns, setDisableBtns] = useState(false);

  const handleOnOpenChangeSelectInput = (open: boolean) => {
    if (width && width < 640) {
      if (open) {
        setDisableBtns(true);
      } else {
        setTimeout(() => {
          setDisableBtns(false);
        }, 1000);
      }
    }
  };
  const form = useForm<z.infer<typeof advcanceSearchFormSchema>>({
    resolver: zodResolver(advcanceSearchFormSchema),
  });

  const onSubmit = (data: z.infer<typeof advcanceSearchFormSchema>) => {
    const newSearchParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      // console.log({ [key]: value });
      if (value) {
        if (key === "date") {
          console.log(value);
          const formatFrom = lightFormat((value as any).from, "yyyy-MM-dd");
          const formatTo = lightFormat((value as any).to, "yyyy-MM-dd");
          table.getColumn(key)?.setFilterValue(value);
          newSearchParams.set("from", formatFrom);
          newSearchParams.set("to", formatTo);
        } else if (key === "status") {
          const ar = value as {
            value: string;
            label: string;
            disable?: boolean | undefined;
          }[];
          const formattedString = ar.reduce((acc, curr, i) => {
            if (!i) return acc + curr.value;
            return acc + "." + curr.value;
          }, "");
          table.getColumn(key)?.setFilterValue(formattedString);
          newSearchParams.set("status", formattedString);
        } else {
          table.getColumn(key)?.setFilterValue(value);
          newSearchParams.set(key, value as string);
        }
      } else {
        table.getColumn(key)?.setFilterValue("");
        newSearchParams.delete(key);
      }
    });
    // console.log(
    //   `${pathname}?${new URLSearchParams(newSearchParams).toString()}`
    // );
    form.reset();

    router.push(
      `${pathname}?${new URLSearchParams(newSearchParams).toString()}`
    );
    setShowAdvancedFilter(false);
  };

  useEffect(() => {
    searchParams.forEach((value, key) => {
      if (
        BOOKING_URL_QUERYPARAM_FILTERS.includes(
          key as BookingURLQueryParamFilters
        ) &&
        value
      ) {
        if (key === "name") return;
        if (key === "to" || key === "from") {
          let filterValue = {};
          if (key === "from") {
            filterValue = { ...filterValue, from: new Date(value) };
          }
          if (key === "to") {
            filterValue = { ...filterValue, to: new Date(value) };
          }
          table.getColumn("date")?.setFilterValue(filterValue);
        } else {
          table.getColumn(key)?.setFilterValue(value);
        }
      }
    });
  }, [searchParams, table]);

  return (
    <>
      <Dialog open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}>
        <DialogContent
          // onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-md w-11/12 rounded-lg"
        >
          <DialogHeader className="space-y-4">
            <DialogTitle>Advanced Search</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          onChange={field.onChange}
                          className="max-w-sm"
                        />
                      </FormControl>
                      <FormDescription>This is case sensitive.</FormDescription>
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    maxLength: {
                      value: 12,
                      message: "Please enter a valid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <CustomPhoneInput
                          value={field.value}
                          disableDropdown
                          countryCodeEditable={false}
                          country="ph"
                          onChange={(value) => {
                            if (value.length === 13) return null;
                            field.onChange(value);
                          }}
                          inputClass={cn(
                            "dark:bg-black bg-red-800 dark:border-gray-300 border-gray-400 border-2 w-48",
                            null,
                            {
                              "dark:border-red-600 border-red-600":
                                form.formState.errors.phone?.message,
                            }
                          )}
                          buttonClass={cn(
                            "dark:bg-gray-800 bg-gray-300 border-2 dark:border-gray-300 border-gray-400 pointer-events-none",
                            null,
                            {
                              "dark:border-red-600 border-red-600":
                                form.formState.errors.phone?.message,
                            }
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover
                          open={calendarOpen}
                          onOpenChange={setCalendarOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value?.to ? (
                                  <span>
                                    {format(field.value.from, "PPP")} -{" "}
                                    {format(field.value.to, "PPP")}
                                  </span>
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                            side="bottom"
                          >
                            <Calendar
                              mode="range"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                // if (date?.to) {
                                //   setCalendarOpen(false);
                                // }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            value={field.value}
                            onChange={field.onChange}
                            defaultOptions={BOOKING_STATUS_ADVANCE_OPTIONS}
                            placeholder="Select status(es)"
                            emptyIndicator={
                              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400 dark:bg-black bg-white">
                                no results found.
                              </p>
                            }
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          </DialogHeader>
          <DialogFooter className="gap-y-4 ">
            <Button
              disabled={disableBtns}
              variant="outline"
              onClick={() => setShowAdvancedFilter(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={disableBtns}
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              Apply filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

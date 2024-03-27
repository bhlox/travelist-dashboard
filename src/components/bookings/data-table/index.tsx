"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  FilterFn,
  SortingFn,
  sortingFns,
  Table as TableType,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatus, DialogEditStatusProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingStatuses } from "@/lib/constants";
import { updateBooking } from "@/lib/actions/bookings";
import { toast } from "react-toastify";
import ToastContent from "@/components/toast/content";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "@/components/svg/loader";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Matcher } from "react-day-picker";
import { format, lightFormat } from "date-fns";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { MdDisplaySettings } from "react-icons/md";
interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      (rowA.columnFiltersMeta[columnId] as any).itemRank!,
      (rowB.columnFiltersMeta[columnId] as any).itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

// #TODO add admin actions and UI.
// #TODO REFACTOR

export default function DateTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [editStatusDialog, setEditStatusDialog] =
    useState<DialogEditStatusProps | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const handleEditStatusDialog = (data: {
    currentStatus: BookingStatus;
    name: string;
    id: number;
  }) => {
    setEditStatusDialog({ ...data });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnVisibility: { id: false, ...columnVisibility },
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      handleEditStatusDialog: (data: {
        currentStatus: BookingStatus;
        name: string;
        id: number;
      }) => handleEditStatusDialog(data),
    },
  });

  const activeFilters = table
    .getState()
    .columnFilters.map((filter) => filter.id);

  return (
    <>
      <div className="flex items-center py-4 justify-between gap-6">
        {activeFilters.length ? (
          <div className="grid grid-cols-2 md:flex gap-2 place-items-center">
            {activeFilters.map((filt) => (
              <Button
                onClick={() => table.getColumn(filt)?.setFilterValue("")}
                key={`active-filter-${filt}`}
              >
                {filt}
              </Button>
            ))}
          </div>
        ) : (
          <Input
            placeholder="Search"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            onClick={() => setShowAdvancedFilter(true)}
            className="w-24 whitespace-normal text-sm md:text-base"
          >
            Advanced Search
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex gap-2">
                <MdDisplaySettings className="text-xl" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DialogEditStatus
          key={`edit-status-${editStatusDialog?.id}`}
          setEditStatusDialog={setEditStatusDialog}
          currentStatus={editStatusDialog?.currentStatus}
          id={editStatusDialog?.id}
          name={editStatusDialog?.name}
        />
        <DialogAdvancedFilter
          showAdvancedFilter={showAdvancedFilter}
          setShowAdvancedFilter={setShowAdvancedFilter}
          table={table}
        />
      </div>
      <DataTablePagination table={table} />
    </>
  );
}

// #TODO refactor
function DialogEditStatus({
  currentStatus,
  name,
  id,
  setEditStatusDialog,
}: DialogEditStatusProps & {
  setEditStatusDialog: React.Dispatch<
    React.SetStateAction<DialogEditStatusProps | null>
  >;
}) {
  const { width } = useWindowSize();
  const [editStatus, setEditStatus] = useState<BookingStatus | undefined>(
    currentStatus
  );
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

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateBooking({ status: editStatus, id: id! }),
    onSuccess: () => {
      toast.success(
        <ToastContent
          title={`Status updated for ${name}`}
          description={`from ${currentStatus} to ${editStatus}`}
        />
      );
      setEditStatusDialog(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
      setEditStatusDialog(null);
    },
  });

  return (
    <>
      <Dialog open={Boolean(id)} onOpenChange={() => setEditStatusDialog(null)}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-md w-11/12 rounded-lg"
        >
          <DialogHeader className="space-y-4">
            <DialogTitle>Update booking status of {name} </DialogTitle>
            <DialogDescription className="space-y-2">
              <label>Current Booking Status</label>
              <Select
                defaultValue={editStatus}
                onValueChange={setEditStatus as any}
                onOpenChange={handleOnOpenChangeSelectInput}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bookingStatuses.map((stats) => (
                    <SelectItem key={`status-${stats}`} value={stats}>
                      {stats}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-y-4 ">
            <Button
              disabled={isPending || disableBtns}
              variant="outline"
              onClick={() => setEditStatusDialog(null)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || disableBtns}
              type="button"
              onClick={() => mutate()}
            >
              {isPending ? <LoadingSpinner /> : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface IAdvancedSearchForm {
  name?: string;
  phone?: string;
  date?: Date;
  status?: BookingStatus;
}

function DialogAdvancedFilter({
  setShowAdvancedFilter,
  showAdvancedFilter,
  table,
}: {
  showAdvancedFilter: boolean;
  setShowAdvancedFilter: React.Dispatch<React.SetStateAction<boolean>>;
  table: TableType<any>;
}) {
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
  const form = useForm<IAdvancedSearchForm>();

  const onSubmit: SubmitHandler<IAdvancedSearchForm> = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "date") {
        return table
          .getColumn(key)
          ?.setFilterValue(lightFormat(value, "yyyy-MM-dd"));
      }
      table.getColumn(key)?.setFilterValue(value);
    });
    form.reset();
    setShowAdvancedFilter(false);
  };
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          onChange={field.onChange}
                          // onChange={(event) =>
                          //   table
                          //     .getColumn("customerName")
                          //     ?.setFilterValue(event.target.value)
                          // }
                          className="max-w-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                        <PhoneInput
                          value={field.value}
                          disableDropdown
                          countryCodeEditable={false}
                          country="ph"
                          onChange={(value) => {
                            if (value.length === 13) return null;
                            field.onChange(value);
                          }}
                          inputClass={cn(
                            "dark:bg-black bg-white dark:border-gray-300 border-gray-400 border-2 w-48",
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
                        <Select
                          onValueChange={field.onChange}
                          onOpenChange={handleOnOpenChangeSelectInput}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {bookingStatuses.map((stats) => (
                              <SelectItem key={`status-${stats}`} value={stats}>
                                {stats}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <FaAnglesLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <FaChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <FaChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <FaAnglesRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

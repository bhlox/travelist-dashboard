"use client";
import { SelectBooking } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { bookingStatuses } from "@/lib/constants";

export const bookingsColumns: ColumnDef<SelectBooking>[] = [
  { accessorKey: "id", header: "ID", enableHiding: true },
  { accessorKey: "customerName", header: "Name", id: "name" },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    id: "phone",
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;
      const formatted = formatPhoneNumber(phoneNumber);
      return <p>{formatted}</p>;
    },
  },
  { accessorKey: "personInCharge", header: "Handler", id: "handler" },
  {
    accessorKey: "selectedDate",
    id: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "selectedTime",
    id: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const time = row.original.selectedTime;
      const formattedTime = time.slice(0, 5);
      return <p>{formattedTime}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      return (
        bookingStatuses.indexOf(rowA.original.status!) -
        bookingStatuses.indexOf(rowB.original.status!)
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "pending") {
        return (
          <span className="bg-yellow-500 px-2 py-1 rounded-lg">Pending</span>
        );
      }
      if (status === "overdue") {
        return <span className="bg-red-500 px-2 py-1 rounded-lg">Overdue</span>;
      }
      if (status === "cancelled") {
        return (
          <span className="bg-gray-500 px-2 py-1 rounded-lg">Cancelled</span>
        );
      }
      if (status === "complete") {
        return (
          <span className="bg-green-500 px-2 py-1 rounded-lg">Complete</span>
        );
      }
      return null;
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem
              onClick={() =>
                (table.options?.meta as any).handleEditStatusDialog({
                  currentStatus: row.original.status,
                  name: row.original.customerName,
                  id,
                })
              }
            >
              Edit status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

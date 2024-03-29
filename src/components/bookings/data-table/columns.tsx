"use client";
import { SelectBooking, UserRoles } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { bookingStatuses } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteBooking } from "@/lib/actions/bookings";
import { toast } from "react-toastify";

export const generateBookingsColumns = ({
  role,
}: {
  role: UserRoles;
}): ColumnDef<SelectBooking>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      id: "ID",
      // had to add this filterFn because id has a type of number. so we have to convert both filterValue and row value to string to make it work
      filterFn: (row, columnId, filterValue: string) => {
        const search = filterValue?.toLowerCase();
        let value = row.getValue(columnId) as string;
        if (typeof value === "number") value = String(value);
        return value?.toLowerCase().includes(search);
      },
      enableHiding: false,
    },
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
    {
      accessorKey: "personInCharge",
      header: "Handler",
      id: "handler",
      enableHiding: role !== "staff",
    },
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
        return <p className="inline-block">{formattedTime}</p>;
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
          return (
            <span className="bg-red-500 px-2 py-1 rounded-lg">Overdue</span>
          );
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
      enableHiding: false,
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              {role !== "staff" ? (
                <DropdownMenuItem
                  onClick={async () => {
                    toast.loading("Deleting booking", {
                      toastId: "toastDelete",
                      position: "top-center",
                    });
                    try {
                      await deleteBooking(id);
                      toast.update("toastDelete", {
                        autoClose: 2500,
                        render: "Deleted successfully",
                        type: "success",
                        isLoading: false,
                      });
                    } catch (error) {
                      console.error(error);
                      toast.update("toastDelete", {
                        autoClose: 2500,
                        render: "Something went wrong",
                        type: "error",
                        isLoading: false,
                      });
                    }
                  }}
                >
                  Delete booking
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import React, { useState } from "react";
import ActiveFiltersList from "./active-filters";
import VisibilityColumn from "./visibility-column";
import { Input } from "@/components/ui/input";
import { FaSearchPlus } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { bookingStatuses } from "@/lib/constants";
import DialogMultiDelete from "../dialog/multi-delete";
import { useMutation } from "@tanstack/react-query";
import { BookingStatus, SelectBooking } from "@/lib/types";
import { toast } from "react-toastify";
import { updateBookings } from "@/lib/actions/bookings";

export default function FilterViewControls<TData>({
  table,
  setShowAdvancedFilter,
  setGlobalFilter,
}: {
  table: Table<TData>;
  setShowAdvancedFilter: (value: React.SetStateAction<boolean>) => void;
  setGlobalFilter: (value: React.SetStateAction<string>) => void;
}) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  return (
    <div className="flex items-start py-4 justify-between gap-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search"
          // value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-xs"
        />
        <ActiveFiltersList table={table} />
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-2">
        {selectedRows ? <MultiRowAction table={table} /> : null}
        <Button
          onClick={() => setShowAdvancedFilter(true)}
          className="text-sm md:text-base flex gap-2 w-[7.5rem] md:w-auto items-center justify-end"
        >
          <FaSearchPlus className="md:text-lg" /> Advance
        </Button>
        <VisibilityColumn table={table} />
      </div>
    </div>
  );
}

function MultiRowAction<TData>({ table }: { table: Table<TData> }) {
  const selectedRowsId = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as SelectBooking).id);

  const [dialogDelete, setDialogDelete] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateStatus", selectedRowsId],
    mutationFn: async (status: BookingStatus) => {
      toast.loading(`Updating bookings statuses to ${status}`, {
        toastId: "toastUpdate",
        position: "top-center",
      });
      const formatted = selectedRowsId.map((id) => ({ id, status }));
      await updateBookings(formatted);
    },
    onSuccess: () => {
      toast.update("toastUpdate", {
        autoClose: 2500,
        render: "Updated successfully",
        type: "success",
        isLoading: false,
      });
    },
    onError: () => {
      toast.update("toastUpdate", {
        autoClose: 2500,
        render: "Something went wrong",
        type: "error",
        isLoading: false,
      });
    },
    onSettled: () => {
      table.toggleAllPageRowsSelected(false);
    },
  });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isPending}
            variant="outline"
            className="text-sm md:text-base flex gap-2 w-[7.5rem] md:w-auto items-center justify-center"
          >
            Action
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>Update status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {bookingStatuses.map((stats) => (
            <DropdownMenuItem
              key={`multirow-dropdown-menu-${stats}`}
              onSelect={() => mutate(stats)}
            >
              {stats}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogDelete(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogMultiDelete
        dialogDelete={dialogDelete}
        setDialogDelete={setDialogDelete}
        table={table}
        selectedRowsId={selectedRowsId}
      />
    </>
  );
}

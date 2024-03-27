"use client";
import React, { useState } from "react";
import {
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  VisibilityState,
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
  BookingStatus,
  DataTableProps,
  DialogEditStatusProps,
} from "@/lib/types";
import { cn, fuzzyFilter } from "@/lib/utils";
import PaginationControls from "./pagination-controls";
import FilterViewControls from "./filter-view-controls";
import DialogEditStatus from "./dialog/edit-status";
import DialogAdvancedFilter from "./dialog/advanced-filter";

// #TODO add admin actions and UI.

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

  return (
    <>
      <FilterViewControls
        setGlobalFilter={setGlobalFilter}
        setShowAdvancedFilter={setShowAdvancedFilter}
        table={table}
      />
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
      <PaginationControls table={table} />
    </>
  );
}

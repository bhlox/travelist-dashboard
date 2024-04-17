"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  ColumnDef,
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
  SelectBooking,
} from "@/lib/types";
import { dateBetweenFilterFn, fuzzyFilter } from "@/lib/utils";
import PaginationControls from "./pagination-controls";
import FilterViewControls from "./filter-view-controls";
import DialogAdvancedFilter from "../../dialog/advanced-filter";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import { generateBookingsColumns } from "./columns";
import { useWindowSize } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DateTable<TData>({
  data,
  searchParams,
  pageCount,
}: DataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParamsHook = useSearchParams();
  const { role, id } = useUserDetailsContext();
  const { width } = useWindowSize();

  const bookingsColumns: ColumnDef<SelectBooking>[] = useMemo(() => {
    return generateBookingsColumns({
      role,
      windowWidth: width || 0,
      router,
      pathname,
      searchParams,
    });
  }, [role, width, router, pathname, searchParams]);

  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [editStatusDialog, setEditStatusDialog] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "date",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  // const query = useQuery({
  //   queryKey: ["bookingsQuery", currentPageIndex],
  //   initialData: data as SelectBooking[],
  //   queryFn: async () => {
  //     console.log("fetching newBookings" + searchParams.get("page"));
  //     return await getBookings({
  //       role,
  //       handlerId: id,
  //       filters: { pageNumber: +searchParams.get("page")! },
  //     });
  //   },
  //   enabled: !isFirstRender,
  // });

  // console.log(query.data[0]);

  const table = useReactTable({
    data,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columns: bookingsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
      dateBetweenFilterFn: dateBetweenFilterFn,
    },
    state: {
      columnVisibility: {
        ID: false,
        ...columnVisibility,
        handler: role === "staff" ? false : columnVisibility.handler,
        select: role !== "staff",
      },
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination: { pageIndex: +searchParams.page - 1, pageSize: 10 },
    },
    // meta: {
    //   handleEditStatusDialog: (data: {
    //     currentStatus: BookingStatus;
    //     name: string;
    //     id: number;
    //   }) => handleEditStatusDialog(data),
    // },
  });

  // code below is only concerned with column visibility for screen width
  useEffect(() => {
    if (width && width > 640 && width < 768) {
      setColumnVisibility((c) => {
        return {
          ...c,
          phone: false,
          handler: false,
        };
      });
    } else if (width && width < 640) {
      setColumnVisibility((c) => {
        return {
          ...c,
          phone: false,
          handler: false,
          time: false,
          status: false,
        };
      });
    } else {
      setColumnVisibility((c) => {
        return {
          ...c,
          phone: true,
          time: true,
          status: true,
          handler: role === "staff" ? false : columnVisibility.handler,
        };
      });
    }
  }, [columnVisibility.handler, role, table, width]);

  return (
    <>
      <FilterViewControls
        setGlobalFilter={setGlobalFilter}
        setShowAdvancedFilter={setShowAdvancedFilter}
        table={table}
      />
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // console.log(header.id, header.getSize());
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
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
                  colSpan={bookingsColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* <DialogEditStatus
          key={`edit-status-${editStatusDialog?.id}`}
          // setEditStatusDialog={setEditStatusDialog}
          currentStatus={editStatusDialog?.currentStatus}
          id={editStatusDialog?.id}
          name={editStatusDialog?.name}
        /> */}
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

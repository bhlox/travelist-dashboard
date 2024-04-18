import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight, FaChevronLeft } from "react-icons/fa6";

export default function PaginationControls<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const { role } = useUserDetailsContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <div
      className={cn("flex items-start px-2", null, {
        "justify-between": role !== "staff",
        "justify-end": role === "staff",
      })}
    >
      <div
        className={cn(
          "flex-1 text-xs sm:text-sm text-muted-foreground text-blance",
          null,
          {
            hidden: role === "staff",
          }
        )}
      >
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
      <div className="flex items-center space-x-2 sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 sm:w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                <SelectLabel>Rows per page</SelectLabel>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex sm:w-[100px] items-center justify-center text-xs sm:text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("page", "1");
              router.push(`${pathname}?${newSearchParams.toString()}`);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <FaAnglesLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => {
              table.previousPage();
              const currentPageNumber =
                table.getState().pagination.pageIndex + 1;
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("page", `${currentPageNumber - 1}`);
              router.push(`${pathname}?${newSearchParams.toString()}`);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <FaChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage();
              const newSearchParams = new URLSearchParams(searchParams);
              const currentPageNumber =
                table.getState().pagination.pageIndex + 1;
              newSearchParams.set("page", `${currentPageNumber + 1}`);
              router.push(`${pathname}?${newSearchParams.toString()}`);
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <FaChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("page", `${table.getPageCount()}`);
              router.push(`${pathname}?${newSearchParams.toString()}`);
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <FaAnglesRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

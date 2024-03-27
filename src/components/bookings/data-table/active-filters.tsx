import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import React from "react";

export default function ActiveFiltersList<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const activeFilters = table
    .getState()
    .columnFilters.map((filter) => filter.id);

  return activeFilters.length ? (
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
  ) : null;
}

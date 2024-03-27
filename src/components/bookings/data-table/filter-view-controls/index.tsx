import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import React from "react";
import ActiveFiltersList from "../active-filters";
import VisibilityColumn from "../visibility-column";
import { Input } from "@/components/ui/input";

export default function FilterViewControls<TData>({
  table,
  setShowAdvancedFilter,
  setGlobalFilter,
}: {
  table: Table<TData>;
  setShowAdvancedFilter: (value: React.SetStateAction<boolean>) => void;
  setGlobalFilter: (value: React.SetStateAction<string>) => void;
}) {
  return (
    <div className="flex items-center py-4 justify-between gap-6">
      <ActiveFiltersList table={table} />
      <Input
        placeholder="Search"
        // value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />

      <div className="flex flex-col md:flex-row gap-2">
        <Button
          onClick={() => setShowAdvancedFilter(true)}
          className="w-24 whitespace-normal text-sm md:text-base"
        >
          Advanced Search
        </Button>
        <VisibilityColumn table={table} />
      </div>
    </div>
  );
}

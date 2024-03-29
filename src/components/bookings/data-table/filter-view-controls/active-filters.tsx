import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function ActiveFiltersList<TData>({
  table,
  activeFilters,
}: {
  table: Table<TData>;
  activeFilters: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleRemoveFilter = (filter: string) => {
    table.getColumn(filter)?.setFilterValue("");
    if (params.size) {
      let urlString = `${pathname}?`;
      params.forEach((value, key) => {
        if (key) {
          if (key === filter) {
            return params.delete(key);
          }
          urlString += `${key}=${value}&`;
        }
      });
      urlString = urlString.slice(0, -1);
      router.replace(urlString);
    }
  };
  return activeFilters.length ? (
    <div className="grid grid-cols-2 md:flex gap-2 place-items-center">
      {activeFilters.map((filt) => (
        <Button
          onClick={() => handleRemoveFilter(filt)}
          key={`active-filter-${filt}`}
        >
          {filt}
        </Button>
      ))}
    </div>
  ) : null;
}

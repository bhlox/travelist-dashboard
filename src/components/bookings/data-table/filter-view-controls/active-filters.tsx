import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { ImCross } from "react-icons/im";
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
  const newSearchParams = new URLSearchParams(searchParams);

  const handleRemoveFilter = (filter: string) => {
    table.getColumn(filter)?.setFilterValue("");
    if (filter === "date") {
      newSearchParams.delete("from");
      newSearchParams.delete("to");
    } else {
      newSearchParams.delete(filter);
    }
    router.push(`${pathname}?${newSearchParams.toString()}`);
    // if (params.size) {
    //   let urlString = `${pathname}?`;
    //   params.forEach((value, key) => {
    //     if (key) {
    //       if (key === filter) {
    //         return params.delete(key);
    //       }
    //       urlString += `${key}=${value}&`;
    //     }
    //   });
    //   urlString = urlString.slice(0, -1);
    //   router.replace(urlString);
    // }
  };
  return activeFilters.length ? (
    <div className="grid grid-cols-2 md:flex gap-2 place-items-center">
      {activeFilters.map((filt) => (
        <Button
          variant={"secondary"}
          onClick={() => handleRemoveFilter(filt)}
          key={`active-filter-${filt}`}
          className="flex gap-2 items-center capitalize px-2 py-0"
        >
          {filt} <ImCross className="text-red-700 text-sm" />
        </Button>
      ))}
    </div>
  ) : null;
}

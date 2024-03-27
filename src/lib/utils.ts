import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumber: string) {
  let cleaned = ("" + phoneNumber).replace(/\D/g, "");
  if (cleaned.length === 12) {
    return (
      "+" +
      cleaned.slice(0, 2) +
      "-" +
      cleaned.slice(2, 5) +
      "-" +
      cleaned.slice(5, 8) +
      "-" +
      cleaned.slice(8)
    );
  } else {
    return phoneNumber;
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      (rowA.columnFiltersMeta[columnId] as any).itemRank!,
      (rowB.columnFiltersMeta[columnId] as any).itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

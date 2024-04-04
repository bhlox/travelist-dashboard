import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookingsSlugAction } from "./types";

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

export const randomIndexNumber = (length: number) => {
  return Math.floor(Math.random() * length);
};

export function isBookingsSlugAction(
  action: string
): action is BookingsSlugAction {
  return action === "edit" || action === "delete";
}

export function isDateInPast(inputDate: Date): boolean {
  const inputDateString = inputDate.toISOString().split("T")[0];
  const currentDateString = new Date().toISOString().split("T")[0];

  const inputDateObj = new Date(inputDateString);
  const currentDateObj = new Date(currentDateString);

  return inputDateObj < currentDateObj;
}

export function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}

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

import { FaHome, FaAddressBook, FaUsers, FaHammer } from "react-icons/fa";
import { BsPersonFill, BsPersonFillGear, BsPersonFillUp } from "react-icons/bs";
import { IoIosTime } from "react-icons/io";
import { DateAfter, DateBefore, Matcher } from "react-day-picker";
import { addDays, eachHourOfInterval, lightFormat } from "date-fns";
import { UserRoles } from "./types";
import { IconType } from "react-icons/lib";
import { Option } from "@/components/ui/multiple-selector";

export const SIDEBAR_ITEMS = [
  // {
  //   name: "Dashboard",
  //   href: "/",
  //   icon: FaHome,
  // },
  {
    name: "Bookings",
    href: "/bookings",
    icon: FaAddressBook,
  },
  {
    name: "Schedule",
    href: "/schedule",
    icon: IoIosTime,
  },
  {
    name: "Users",
    href: "/users",
    icon: FaUsers,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: BsPersonFillGear,
  },
];

export const USER_ROLES = ["owner", "admin", "staff", "developer"] as const;

// export const OPENING_HOURS = [
//   { day: "Monday", from: "10:00", to: "18:00" },
//   { day: "Tuesday", from: "10:00", to: "18:00" },
//   { day: "Wednesday", from: "10:00", to: "18:00" },
//   { day: "Thursday", from: "10:00", to: "18:00" },
//   { day: "Friday", from: "10:00", to: "18:00" },
//   { day: "Saturday", from: "10:00", to: "18:00" },
//   { day: "Sunday", from: "10:00", to: "18:00" },
// ];
// const disabledTimes = ["12:00", "15:00"];

const openingHoursInterval = eachHourOfInterval({
  start: new Date(2014, 9, 6, 9),
  end: new Date(2014, 9, 6, 18),
});
export const OPENING_HOURS = openingHoursInterval.map((dt) =>
  lightFormat(dt, "HH:mm")
);

export const BEFORE_TOMORROW: DateBefore = { before: new Date() };
export const AFTER_31_DAYS: DateAfter = { after: addDays(new Date(), 31) };

export const DISABLE_WEEKENDS: Matcher = (date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

//   const disableDays: Matcher = [new Date(2024, 2, 26), new Date(2024, 2, 28)];

export const BOOKING_STATUSES = [
  "pending",
  "overdue",
  "cancelled",
  "complete",
] as const;

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
export const MAX_IMAGE_SIZE = 4; //In MegaBytes

export const SIZE_IN_MB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

export const DEFAULT_DB_PROF_PIC_STRING = "/avatar_default.jpg" as const;

export const LOGIN_RNDM_IMG_LIST = [
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1194&q=80",
  "https://images.unsplash.com/photo-1559666126-84f389727b9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1177&q=80",
  "https://images.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1559&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
  "https://images.unsplash.com/photo-1462400362591-9ca55235346a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1664&q=80",
  "https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1508163223045-1880bc36e222?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
  "https://images.unsplash.com/photo-1503424886307-b090341d25d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1431631927486-6603c868ce5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
];

export const ROLE_ICONS: { role: UserRoles; icon: IconType }[] = [
  { role: "owner", icon: BsPersonFillUp },
  { role: "admin", icon: BsPersonFillGear },
  { role: "staff", icon: BsPersonFill },
  { role: "developer", icon: FaHammer },
];

export const BOOKING_STATUS_ADVANCE_OPTIONS: Option[] = [
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Complete", value: "complete" },
];

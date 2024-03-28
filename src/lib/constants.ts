import { FaHome, FaAddressBook } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { IoIosTime } from "react-icons/io";
import { DateAfter, DateBefore, Matcher } from "react-day-picker";
import { addDays, eachHourOfInterval, lightFormat } from "date-fns";

export const sideBarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: FaHome,
  },
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
    name: "Profile",
    href: "/profile",
    icon: BsPersonFillGear,
  },
];

export const userRoles = ["owner", "admin", "staff"] as const;

// export const openingHours = [
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
export const openingHours = openingHoursInterval.map((dt) =>
  lightFormat(dt, "HH:mm")
);

export const beforeTomorrow: DateBefore = { before: new Date() };
export const after31Days: DateAfter = { after: addDays(new Date(), 31) };

export const disableWeekends: Matcher = (date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

//   const disableDays: Matcher = [new Date(2024, 2, 26), new Date(2024, 2, 28)];

export const bookingStatuses = [
  "pending",
  "overdue",
  "cancelled",
  "complete",
] as const;

import { FaHome, FaAddressBook, FaUsers } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { IoIosTime } from "react-icons/io";
import { DateAfter, DateBefore, Matcher } from "react-day-picker";
import { addDays, eachHourOfInterval, lightFormat } from "date-fns";

export const sideBarItems = [
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

export const userRoles = ["owner", "admin", "staff", "developer"] as const;

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

export const loginRandomImagesList = [
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

import { FaHome, FaAddressBook } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { IoIosTime } from "react-icons/io";

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

export const userRoles = ["owner", "admin", "staff"];

export const openingHours = [
  { day: "Monday", from: "10:00", to: "18:00" },
  { day: "Tuesday", from: "10:00", to: "18:00" },
  { day: "Wednesday", from: "10:00", to: "18:00" },
  { day: "Thursday", from: "10:00", to: "18:00" },
  { day: "Friday", from: "10:00", to: "18:00" },
  { day: "Saturday", from: "10:00", to: "18:00" },
  { day: "Sunday", from: "10:00", to: "18:00" },
];

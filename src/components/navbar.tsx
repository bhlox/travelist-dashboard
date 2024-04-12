"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useSideBarContext } from "./providers/sidebar-provider";
import { GiHamburgerMenu } from "react-icons/gi";
import ThemeToggler from "./ui/theme-toggler";
import { useUserDetailsContext } from "./providers/user-details-provider";
import { ROLE_ICONS } from "@/lib/constants";

export default function Navbar() {
  const { toggleSidebar } = useSideBarContext();
  const { displayname, role } = useUserDetailsContext();
  const Icon = ROLE_ICONS.filter((i) => i.role === role)[0].icon;
  return (
    <header className="z-40 p-4 dark:bg-slate-950 flex justify-between lg:justify-end items-center border-b-2 dark:border-gray-700 shadow-md bg-white">
      <GiHamburgerMenu
        onClick={toggleSidebar}
        className="text-black fill-black dark:fill-gray-100 size-6 w-6 cursor-pointer block lg:hidden"
      />
      <div className="flex items-center gap-4">
        {<Icon className="text-2xl" />}
        <p>{displayname}</p>
        <ThemeToggler />
      </div>
    </header>
  );
}

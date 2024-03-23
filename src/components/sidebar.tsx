"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSideBarContext } from "./providers/sidebar-provider";
import { FaHome } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import { sideBarItems } from "@/lib/constants";
import { useWindowSize } from "@uidotdev/usehooks";
import { usePathname } from "next/navigation";

export default function SideBar() {
  return (
    <>
      <Desktop />
      <Mobile />
    </>
  );
}

function Desktop() {
  return (
    <>
      <aside className="z-30 flex-shrink-0 hidden overflow-y-auto bg-white dark:bg-slate-900 lg:block border-r-2 dark:border-gray-600">
        <Content />
      </aside>
    </>
  );
}

function Mobile() {
  const { isSidebarOpen, toggleSidebar } = useSideBarContext();
  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="text-3xl font-bold">Overview</SheetTitle>
            <SheetDescription>
              <Content />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Content() {
  const size = useWindowSize();
  const { toggleSidebar } = useSideBarContext();
  const pathname = usePathname();
  return (
    <ul className="border-t-2">
      {sideBarItems.map((item) => (
        <li
          key={`sidebar-item-${item.name}`}
          className={cn("", null, {
            "bg-gray-200 dark:bg-slate-800": pathname === item.href,
          })}
        >
          <Link
            onClick={() => {
              if (size.width && size?.width < 1024) toggleSidebar();
            }}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-2xl font-bold p-4",
              null
            )}
          >
            <item.icon /> {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

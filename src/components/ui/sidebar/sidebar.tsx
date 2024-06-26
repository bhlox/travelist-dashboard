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
import { useSideBarContext } from "../../providers/sidebar-provider";
import { FaHome } from "react-icons/fa";
import { Button } from "../button";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { useWindowSize } from "@uidotdev/usehooks";
import { usePathname } from "next/navigation";
import { useUserDetailsContext } from "../../providers/user-details-provider";
import { TbLogout2 } from "react-icons/tb";
import { logoutUser } from "@/lib/actions/auth";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../../svg/loader";
import { toast } from "react-toastify";
import { RiBox3Fill } from "react-icons/ri";

export default function SideBarClient({
  pendingScheduleLength,
}: {
  pendingScheduleLength: number;
}) {
  return (
    <>
      <Desktop pendingScheduleLength={pendingScheduleLength} />
      <Mobile pendingScheduleLength={pendingScheduleLength} />
    </>
  );
}

function Desktop({ pendingScheduleLength }: { pendingScheduleLength: number }) {
  return (
    <>
      <aside className="z-30 flex-shrink-0 hidden overflow-y-auto bg-white dark:bg-slate-950 lg:block border-r dark:border-gray-700 border-gray-400">
        <Content pendingScheduleLength={pendingScheduleLength} />
      </aside>
    </>
  );
}

function Mobile({ pendingScheduleLength }: { pendingScheduleLength: number }) {
  const { isSidebarOpen, toggleSidebar } = useSideBarContext();
  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
        <SheetContent className="h-full" side="left">
          <SheetDescription className="h-full">
            <Content pendingScheduleLength={pendingScheduleLength} />
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Content({ pendingScheduleLength }: { pendingScheduleLength: number }) {
  const size = useWindowSize();
  const { toggleSidebar } = useSideBarContext();
  const { role } = useUserDetailsContext();
  const pathname = usePathname();
  const mappedSideBar = SIDEBAR_ITEMS.filter((item) => {
    if (item.name === "Users" && role !== "owner") return false;
    return true;
  });

  return (
    <div className="flex flex-col justify-between h-full relative">
      <div>
        <div className="flex justify-center p-2 items-center gap-2 lg:px-4">
          <RiBox3Fill className="text-7xl" />{" "}
          <span className="text-3xl hidden sm:inline-block text-neutral-500 dark:text-neutral-400">
            Menu
          </span>
        </div>
        <ul className="border-t dark:border-gray-700 border-gray-400">
          {mappedSideBar.map((item) => (
            <li
              key={`sidebar-item-${item.name}`}
              className={cn("", null, {
                "bg-gray-300 dark:bg-slate-800": pathname === item.href,
              })}
            >
              <Link
                onClick={() => {
                  if (size.width && size?.width < 1024) toggleSidebar();
                }}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 font-bold p-4 relative",
                  null,
                  {
                    "text-black dark:text-white/80": pathname === item.href,
                    "text-neutral-500 dark:text-neutral-400":
                      pathname !== item.href,
                  }
                )}
              >
                <item.icon className="text-2xl " />
                <span className="text-lg">{item.name}</span>
                {item.name === "Schedule" && role !== "staff" && (
                  <div className="absolute size-6 grid place-items-center top-1/2 -translate-y-1/2 right-4 z-10 bg-blue-500 dark:bg-blue-700 rounded-full dark:text-white text-black">
                    <span>{pendingScheduleLength}</span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <LogoutBtn />
    </div>
  );
}

function LogoutBtn() {
  const { mutate, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logoutUser(),
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return (
    <Button
      disabled={isPending}
      className="m-4 lg:m-2 items-center gap-2"
      onClick={() => mutate()}
    >
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <>
          <TbLogout2 className="text-xl" /> <span>Logout</span>
        </>
      )}
    </Button>
  );
}

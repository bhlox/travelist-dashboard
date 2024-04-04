"use client";
import React from "react";
import { useSideBarContext } from "./providers/sidebar-provider";
import { cn } from "@/lib/utils";

export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useSideBarContext();
  return (
    <div
      className={cn("flex h-[100dvh] dark:bg-black/10 bg-gray-300/80", null, {
        "overflow-hidden": isSidebarOpen,
      })}
    >
      {children}
    </div>
  );
}

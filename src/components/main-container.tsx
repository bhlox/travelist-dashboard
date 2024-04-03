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
      className={cn("flex h-[100dvh] ", null, {
        "overflow-hidden": isSidebarOpen,
      })}
    >
      {children}
    </div>
  );
}

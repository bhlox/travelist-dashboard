"use client";
import { ISidebarContext } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

export const SidebarContext = createContext<ISidebarContext>({
  isSidebarOpen: false,
  closeSidebar: () => {},
  toggleSidebar: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((c) => !c);
  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        closeSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSideBarContext = () => useContext(SidebarContext);

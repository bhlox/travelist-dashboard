import { getPendingSchedulesLength } from "@/lib/actions/schedule";
import React from "react";
import SideBarClient from "./sidebar";

export default async function Sidebar() {
  const data = await getPendingSchedulesLength();
  return <SideBarClient pendingScheduleLength={data} />;
}

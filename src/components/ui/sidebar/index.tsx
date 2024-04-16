import { getPendingSchedulesLength } from "@/lib/actions/schedule";
import React from "react";
import SideBarClient from "./sidebar";
import { getUser } from "@/lib/actions/auth";

export default async function Sidebar() {
  const user = await getUser();
  if (!user) return null;
  const data =
    user.user?.role !== "staff" ? await getPendingSchedulesLength() : 0;
  return <SideBarClient pendingScheduleLength={data} />;
}

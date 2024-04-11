import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";
import Headings from "@/components/ui/headings";
import { getUser } from "@/lib/actions/auth";

export default async function BookingsPage() {
  const user = await getUser();
  if (!user || !user.user) {
    throw new Error("User not found");
  }

  const bookings = await getBookings({
    handlerId: user.user.id,
    role: user.user.role,
  });

  return (
    <>
      <Headings title="Bookings" description="Manage user bookings" />
      <DataTable data={bookings} />
    </>
  );
}

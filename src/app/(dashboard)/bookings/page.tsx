import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";
import Headings from "@/components/ui/headings";
import { getUser } from "@/lib/actions/auth";
import { headers } from "next/headers";

export default async function BookingsPage() {
  const user = await getUser();
  if (!user || !user.user) {
    throw new Error("User not found");
  }
  const headersList = headers();
  const hostname = headersList.get("x-forwarded-host");
  console.log({ hostname });

  const bookings = await getBookings({
    handlerId: user.user.id,
    role: user.user.role,
    testRole: user.user.testRole,
  });

  return (
    <>
      <Headings title="Bookings" description="Manage user bookings" />
      <DataTable data={bookings} />
    </>
  );
}

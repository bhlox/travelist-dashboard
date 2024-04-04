import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";
import Headings from "@/components/ui/headings";

export default async function BookingsPage() {
  const bookings = await getBookings();
  const asd = [
    ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
    // ...bookings,
  ];
  return (
    <>
      <Headings title="Bookings" description="Manage user bookings" />
      <DataTable data={asd} />
    </>
  );
}

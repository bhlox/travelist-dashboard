import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";

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
    <div>
      <DataTable data={asd} />
    </div>
  );
}

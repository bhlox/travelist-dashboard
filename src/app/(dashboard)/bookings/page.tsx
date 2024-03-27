import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";
import { bookingsColumns } from "@/components/bookings/data-table/columns";

export default async function BookingsPage() {
  const bookings = await getBookings();
  const asd = [
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
    ...bookings,
  ];
  return (
    <div>
      <DataTable columns={bookingsColumns} data={asd} />
    </div>
  );
}

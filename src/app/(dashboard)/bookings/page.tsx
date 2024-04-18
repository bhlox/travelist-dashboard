import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";
import Headings from "@/components/ui/headings";
import { getUser } from "@/lib/actions/auth";
import { BookingStatus, SelectBooking } from "@/lib/types";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const user = await getUser();
  if (!user || !user.user) {
    throw new Error("User not found");
  }

  const pageNumber = searchParams.page ? +searchParams.page : 1;
  const sortField = searchParams.sort?.split(".")[0] as keyof SelectBooking;
  const sortDirection = searchParams.sort?.split(".")[1] as "asc" | "desc";
  searchParams.page = pageNumber.toString();
  const bookings = await getBookings({
    handlerId: user.user.id,
    role: "admin",
    testRole: user.user.testRole,
    filters: {
      pageNumber,
      getPageCount: true,
      sort: { field: sortField, direction: sortDirection },
      dateRange: { start: searchParams?.from, end: searchParams?.to },
      status: searchParams?.status?.split(".") as BookingStatus[],
      name: searchParams?.name,
      phone: searchParams?.phone,
    },
  });

  return (
    <>
      <Headings title="Bookings" description="Manage user bookings" />
      <DataTable
        data={bookings.data}
        searchParams={searchParams}
        pageCount={bookings.count ?? 1}
      />
    </>
  );
}

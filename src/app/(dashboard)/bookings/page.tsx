import { getBookings } from "@/lib/actions/bookings";
import React from "react";
import DataTable from "@/components/bookings/data-table/index";
import Headings from "@/components/ui/headings";
import { getUser } from "@/lib/actions/auth";

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const user = await getUser();
  if (!user || !user.user) {
    throw new Error("User not found");
  }

  const pageNumber = searchParams.page ? +searchParams.page : 1;
  searchParams.page = (pageNumber - 1).toString();
  const bookings = await getBookings({
    handlerId: user.user.id,
    role: user.user.role,
    testRole: user.user.testRole,
    filters: { pageNumber, getPageCount: true },
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

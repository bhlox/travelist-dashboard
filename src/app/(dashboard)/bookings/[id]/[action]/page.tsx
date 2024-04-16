
import { getBooking } from "@/lib/actions/bookings";
import React, { useState } from "react";
import BookingActionPageClient from "./client";

export default async function BookingActionPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const bookingDetails = await getBooking(+params.id);
  if (!bookingDetails) {
    throw new Error("missing booking details");
  }

  return (
    <BookingActionPageClient
      bookingDetails={bookingDetails}
      action={params.action as any}
    />
  );
}

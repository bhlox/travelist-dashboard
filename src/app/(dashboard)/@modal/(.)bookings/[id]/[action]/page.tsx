import { getBooking } from "@/lib/actions/bookings";
import React from "react";
import BookingActionModal from "./modal";
import { BookingsSlugAction } from "@/lib/types";
import { isBookingsSlugAction } from "@/lib/utils";

export default async function BookingModalActionPage({
  params,
}: {
  params: { id: string; action: BookingsSlugAction };
}) {
  const bookingId = params.id;
  const action = params.action;
  if (!isBookingsSlugAction(action)) {
    console.error("Invalid action");
    // throw new Error("Invalid action");
  }
  // if (!bookingId || !action)
  //   throw new Error("No id or action found for booking");
  const bookingDetails = await getBooking(+params.id);
  return bookingDetails ? (
    <BookingActionModal
      bookingId={+bookingId}
      bookingDetails={bookingDetails}
      action={action}
    />
  ) : null;
}

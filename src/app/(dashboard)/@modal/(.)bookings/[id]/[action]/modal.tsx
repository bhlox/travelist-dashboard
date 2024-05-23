"use client";

import DialogDeleteConfirmation from "@/components/dialog/delete-confirmation";
import DialogEditStatus from "@/components/dialog/edit-status";
import { deleteBooking } from "@/lib/actions/bookings";
import {
  BookingStatus,
  BookingsSlugAction,
  SelectBookingWithHandlerInfo,
} from "@/lib/types";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function BookingActionModal({
  bookingId,
  bookingDetails,
  action,
}: {
  bookingId: number;
  bookingDetails: SelectBookingWithHandlerInfo;
  action: BookingsSlugAction;
}) {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  console.log(bookingDetails);
  return (
    <>
      {action === "edit" ? (
        <DialogEditStatus
          id={bookingId}
          name={bookingDetails.customerName}
          currentStatus={bookingDetails.status!}
        />
      ) : null}
      {action === "delete" ? (
        <DialogDeleteConfirmation
          dialogTitle={`Confirm booking deletion for ${bookingDetails.customerName}`}
          dialogDescription={
            <>
              <p>Details are as follows:</p>
              <ul className="list-disc list-inside">
                <li>Handler: {bookingDetails.handler.displayname}</li>
                <li>Date: {bookingDetails.selectedDate}</li>
                <li>Time: {bookingDetails.selectedTime}</li>
                <li>Status: {bookingDetails.status}</li>
              </ul>
            </>
          }
          idToBeDeleted={bookingId}
          sucessMsg={{ title: "Booking deleted", description: undefined }}
          errorMsg="Could not delete booking. Please try again."
          deleteFn={deleteBooking}
          setDeleteDialog={undefined}
          redirectTo={redirectTo}
        />
      ) : null}
    </>
  );
}

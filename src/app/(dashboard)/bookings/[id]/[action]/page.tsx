import LoadingSpinner from "@/components/svg/loader";
import ToastContent from "@/components/toast/content";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBooking, updateBooking } from "@/lib/actions/bookings";
import { bookingStatuses } from "@/lib/constants";
import { SelectBooking } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useWindowSize } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
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

"use client";
import LoadingSpinner from "@/components/svg/loader";
import ToastContent from "@/components/toast/content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Headings from "@/components/ui/headings";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteBooking,
  getBooking,
  updateBooking,
} from "@/lib/actions/bookings";
import { bookingStatuses } from "@/lib/constants";
import { SelectBooking } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useWindowSize } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function BookingActionPageClient({
  bookingDetails,
  action,
}: {
  bookingDetails: SelectBooking;
  action: "edit" | "delete";
}) {
  return (
    <>
      <Headings
        title="Booking Details"
        description={`Currently executing "${action}" action`}
      />
      {action === "edit" && <EditUI bookingDetails={bookingDetails!} />}
      {action === "delete" && <DeleteUI bookingDetails={bookingDetails!} />}
    </>
  );
}

function EditUI({ bookingDetails }: { bookingDetails: SelectBooking }) {
  const router = useRouter();
  const { width } = useWindowSize();
  const [editStatus, setEditStatus] = useState(bookingDetails.status!);
  const [disableBtns, setDisableBtns] = useState(false);

  const handleOnOpenChangeSelectInput = (open: boolean) => {
    if (width && width < 640) {
      if (open) {
        setDisableBtns(true);
      } else {
        setTimeout(() => {
          setDisableBtns(false);
        }, 1000);
      }
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateBooking({ status: editStatus, id: bookingDetails.id }),
    onSuccess: () => {
      toast.success(
        <ToastContent
          title={`Status updated for ${bookingDetails.customerName}`}
          description={`from ${bookingDetails.status} to ${editStatus}`}
        />
      );
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return (
    <Card className="max-w-lg mt-6">
      <CardHeader>
        <CardTitle>{bookingDetails.customerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CardDescription>
          <ul className="list-disc list-inside">
            <li>Status: {bookingDetails.status}</li>
            <li>Handler: {bookingDetails.personInCharge}</li>
            <li>Date: {bookingDetails.selectedDate}</li>
            <li>Time: {bookingDetails.selectedTime}</li>
          </ul>
        </CardDescription>

        <form onSubmit={() => mutate()} className="space-y-2">
          <Label>Current Booking Status</Label>
          <Select
            defaultValue={editStatus}
            onValueChange={setEditStatus as any}
            onOpenChange={handleOnOpenChangeSelectInput}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bookingStatuses.map((stats) => (
                <SelectItem key={`status-${stats}`} value={stats}>
                  {stats}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={isPending || disableBtns}
            type="button"
            onClick={() => mutate()}
            typeof="submit"
          >
            {isPending ? <LoadingSpinner /> : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DeleteUI({ bookingDetails }: { bookingDetails: SelectBooking }) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteBooking(bookingDetails.id),
    onSuccess: () => {
      toast.success(
        <ToastContent
          title={`Deleted booking of ${bookingDetails.customerName}`}
          description={undefined}
        />
      );
      router.replace("/bookings");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return (
    <>
      <Card className="max-w-lg mt-6">
        <CardHeader>
          <CardTitle>{bookingDetails.customerName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Status: {bookingDetails.status}</li>
            <li>Handler: {bookingDetails.personInCharge}</li>
            <li>Date: {bookingDetails.selectedDate}</li>
            <li>Time: {bookingDetails.selectedTime}</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={() => mutate()}>
            {isPending ? <LoadingSpinner /> : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

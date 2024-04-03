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
import { getBooking } from "@/lib/actions/bookings";
import Link from "next/link";
import React from "react";
import { FaTrash } from "react-icons/fa";

export default async function BookingIdPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const booking = await getBooking(+params.id);
  return (
    <>
      <Headings title="Booking Details" description={undefined} />
      <Card className="mt-8 max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardDescription>Booked at: {booking?.bookedAt}</CardDescription>
            <CardTitle>{booking?.customerName}</CardTitle>
          </div>
          <Link
            href={`/bookings/${params.id}/delete?redirectTo=bookings`}
            className="p-1 inline"
          >
            <FaTrash className="text-gray-400 hover:text-gray-600" />
          </Link>
        </CardHeader>
        <CardContent>
          <h3>Details</h3>
          <ul className="list-disc list-inside">
            <li>Handler: {booking?.personInCharge}</li>
            <li>Date: {booking?.selectedDate}</li>
            <li>Time: {booking?.selectedTime}</li>
            <li>Status: {booking?.status}</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href={`/bookings/${params.id}/edit`}>Edit status</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

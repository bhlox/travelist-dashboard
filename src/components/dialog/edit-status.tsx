import ToastContent from "@/components/toast/content";
import { updateBooking } from "@/lib/actions/bookings";
import { BookingStatus, DialogEditStatusProps } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useWindowSize } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingStatuses } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/svg/loader";
import { useRouter } from "next/navigation";

export default function DialogEditStatus({
  currentStatus,
  name,
  id,
}: DialogEditStatusProps) {
  const router = useRouter();
  const { width } = useWindowSize();
  const [editStatus, setEditStatus] = useState<BookingStatus | undefined>(
    currentStatus
  );
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
    mutationFn: () => updateBooking({ status: editStatus, id: id! }),
    onSuccess: () => {
      toast.success(
        <ToastContent
          title={`Status updated for ${name}`}
          description={`from ${currentStatus} to ${editStatus}`}
        />
      );
      // router.replace(`/bookings/${id}`);
      router.back();
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md w-11/12 rounded-lg"
      >
        <DialogHeader className="space-y-4">
          <DialogTitle>Update booking status of {name} </DialogTitle>
          <DialogDescription className="space-y-2">
            <label>Current Booking Status</label>
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
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-y-4 ">
          <Button
            disabled={isPending || disableBtns}
            variant="outline"
            onClick={() => router.back()}
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending || disableBtns}
            type="button"
            onClick={() => mutate()}
          >
            {isPending ? <LoadingSpinner /> : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

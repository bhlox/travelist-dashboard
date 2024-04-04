import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { deleteBookings } from "@/lib/actions/bookings";
import LoadingSpinner from "@/components/svg/loader";

export default function DialogMultiDelete<TData>({
  dialogDelete,
  setDialogDelete,
  table,
  selectedRowsId,
}: {
  setDialogDelete: React.Dispatch<React.SetStateAction<boolean>>;
  dialogDelete: boolean;
  table: Table<TData>;
  selectedRowsId: number[];
}) {
  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteBookings", selectedRowsId],
    mutationFn: async () => {
      toast.loading("Deleting bookings", {
        toastId: "toastDelete",
        position: "top-center",
      });
      await deleteBookings(selectedRowsId);
    },
    onSuccess: () => {
      toast.update("toastDelete", {
        autoClose: 2500,
        render: "Deleted successfully",
        type: "success",
        isLoading: false,
      });
    },
    onError: () => {
      toast.update("toastDelete", {
        autoClose: 2500,
        render: "Something went wrong",
        type: "error",
        isLoading: false,
      });
    },
    onSettled: () => {
      table.toggleAllPageRowsSelected(false);
      setDialogDelete(false);
    },
  });

  return (
    <Dialog open={dialogDelete} onOpenChange={setDialogDelete}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md w-11/12 rounded-lg"
      >
        <DialogHeader className="space-y-4">
          <DialogTitle>Confirm Multi delete</DialogTitle>
          <DialogDescription className="space-y-2">
            Are you sure you want to delete {selectedRowsId.length} booking(s)?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-y-4">
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => setDialogDelete(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button disabled={isPending} type="button" onClick={() => mutate()}>
            {isPending ? <LoadingSpinner /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

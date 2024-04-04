import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import ToastContent from "../toast/content";
import LoadingSpinner from "../svg/loader";
import { useRouter } from "next/navigation";
import { DeleteDialogConfirmationProps } from "@/lib/types";

export default function DialogDeleteConfirmation({
  idToBeDeleted,
  setDeleteDialog,
  sucessMsg,
  dialogTitle,
  errorMsg,
  dialogDescription,
  deleteFn,
  setUserDeletionSuccess,
  redirectTo,
}: DeleteDialogConfirmationProps) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => await deleteFn(idToBeDeleted),
    onSuccess: () => {
      toast.success(
        <ToastContent
          title={sucessMsg.title}
          description={sucessMsg.description}
        />
      );
      if (setUserDeletionSuccess) setUserDeletionSuccess(true);
    },
    onError: () => {
      toast.error(errorMsg);
    },
    onSettled: () => {
      if (setDeleteDialog) {
        return setDeleteDialog(false);
      }
      if (redirectTo) {
        return router.replace(`/${redirectTo}`);
      }
      router.back();
    },
  });
  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (setDeleteDialog) {
          return setDeleteDialog(open);
        }
        if (redirectTo) {
          return router.replace(`/${redirectTo}`);
        }
        router.back();
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md w-11/12 rounded-lg"
      >
        <DialogHeader className="space-y-4">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className="space-y-2">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-y-4">
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => {
              if (setDeleteDialog) {
                setDeleteDialog(false);
              } else {
                router.back();
              }
            }}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            type="button"
            onClick={() => mutate()}
          >
            {isPending ? <LoadingSpinner /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

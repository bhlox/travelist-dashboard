import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteUser } from "@/lib/actions/user";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";

export default function DialogDeleteUser({
  id,
  username,
  setDeleteUserDialog,
  setUserDeletionSuccess,
}: {
  id: string;
  username: string;
  setDeleteUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setUserDeletionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => await deleteUser(id),
    onSuccess: (data) => {
      toast.success(`Deleted user ${data}`);
      setUserDeletionSuccess(true);
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      setDeleteUserDialog(false);
    },
  });
  return (
    <Dialog defaultOpen>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md w-11/12 rounded-lg"
      >
        <DialogHeader className="space-y-4">
          <DialogTitle>Confirm User deletion</DialogTitle>
          <DialogDescription className="space-y-2">
            Are you sure you want to delete {username} from your users?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-y-4">
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => setDeleteUserDialog(false)}
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
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

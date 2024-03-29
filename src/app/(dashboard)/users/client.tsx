"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalSearchUser, SelectUser } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaTrash } from "react-icons/fa";
import { globalSearchUser, updateUserDetails } from "@/lib/actions/user";
import { useMutation } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import LoadingSpinner from "@/components/svg/loader";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { toast } from "react-toastify";
import DialogDeleteUser from "@/components/dialog/delete-user";

export default function ClientUsersPage() {
  const isFirstRender = useIsFirstRender();
  const [userDeletionSuccess, setUserDeletionSuccess] = useState(false);
  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 700);

  const { mutate, data, isPending } = useMutation({
    mutationFn: (value: string) => globalSearchUser(value),
  });

  // #TODO refactor 2 useffect below???

  useEffect(() => {
    if (!isFirstRender) {
      mutate(debouncedSearchString);
    }
  }, [debouncedSearchString, mutate, isFirstRender]);

  useEffect(() => {
    if (userDeletionSuccess) {
      mutate(debouncedSearchString);
      setUserDeletionSuccess(false);
    }
  }, [debouncedSearchString, mutate, userDeletionSuccess]);

  return (
    <div className="space-y-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Search user(s)</CardTitle>
          <CardDescription>
            Find user either by their id, email, username, or display name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="User Details here"
          />
        </CardContent>
      </Card>
      <div className="max-w-3xl">
        {isPending ? (
          <div className="flex justify-center items-center gap-2">
            <LoadingSpinner height="36" width="36" />{" "}
            <span className="text-lg font-light">Searching...</span>
          </div>
        ) : data?.length ? (
          <div className="grid place-items-center md:grid-cols-2 gap-3">
            {data?.map((details) => (
              <SearchedUserCard
                key={`searched-user-${details.id}`}
                details={details}
                setUserDeletionSuccess={setUserDeletionSuccess}
              />
            ))}
          </div>
        ) : isFirstRender ? null : (
          <p className="text-center text-lg font-medium">No users found</p>
        )}
      </div>
    </div>
  );
}

function SearchedUserCard({
  details,
  setUserDeletionSuccess,
}: {
  details: GlobalSearchUser;
  setUserDeletionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [role, setRole] = useState(details.role!);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: () => updateUserDetails({ update: { id: details.id, role } }),
    onSuccess: () => {
      toast.success(`Updated role of ${details.displayname} to ${role}`);
    },
    onError: () => {
      toast.error(`Failed to update role of ${details.displayname}`);
    },
  });

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {details.displayname || "default"}{" "}
                <FaTrash className="inline" />
              </CardTitle>
              <CardDescription>Role: {details.role}</CardDescription>
            </div>
            <button onClick={() => setDeleteUserDialog(true)} className="p-1">
              <FaTrash className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            <li>Username: {details.username}</li>
            <li>Email: test@test.com</li>
          </ul>
          <div className="mt-4 space-y-2">
            <Label htmlFor="role">Update role</Label>
            <Select onValueChange={(val) => setRole(val as "admin" | "staff")}>
              <SelectTrigger id="role">
                <SelectValue placeholder={details.role} />
              </SelectTrigger>
              <SelectContent position="popper">
                {["admin", "staff"].map((role) => (
                  <SelectItem key={`user-role-${role}`} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button disabled={isPendingUpdate} onClick={() => mutateUpdate()}>
              {isPendingUpdate ? <LoadingSpinner /> : "Update"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {deleteUserDialog && (
        <DialogDeleteUser
          id={details.id}
          username={details.username}
          setDeleteUserDialog={setDeleteUserDialog}
          setUserDeletionSuccess={setUserDeletionSuccess}
        />
      )}
    </>
  );
}

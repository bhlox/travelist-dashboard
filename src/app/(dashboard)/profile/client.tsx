"use client";
import React from "react";
import Headings from "@/components/ui/headings";
import { SelectUser } from "@/lib/types";
import ProfilePictureForm from "@/components/forms/profile/prof-pic";
import DisplayNameForm from "@/components/forms/profile/display-name";
import UsernameForm from "@/components/forms/profile/user-name";
import PasswordForm from "@/components/forms/profile/password";
import TestRoleForm from "@/components/forms/profile/test-role";
import DescriptionForm from "@/components/forms/profile/description";

// #BUG something weird when zooming with scrolls. this only happens here not others pages

export default function ClientProfilePage({
  userDetails,
}: {
  userDetails: Omit<SelectUser, "hashedPassword">;
}) {
  return (
    <div className="space-y-4">
      <Headings
        title="Profile settings"
        description="Update your profile information"
      />
      <ProfilePictureForm currentPicture={userDetails.profilePicture} />
      <div className="flex flex-col md:flex-row justify-between gap-4  max-w-3xl">
        <DisplayNameForm currentDisplayName={userDetails.displayname} />
        <UsernameForm currentUsername={userDetails.username} />
      </div>
      <PasswordForm />
      <DescriptionForm currentDescription={userDetails.description} />
      {userDetails.role === "developer" && <TestRoleForm />}
    </div>
  );
}

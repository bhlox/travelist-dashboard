import React from "react";
import ClientProfilePage from "./client";
import { getUser } from "@/lib/actions/auth";
import { findUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user || !user.user) return redirect("/login");
  const userDetails = await findUser({
    username: user.user.username,
    withPassword: false,
  });
  if (!userDetails) {
    throw new Error("User not found");
  }
  return <ClientProfilePage userDetails={userDetails} />;
}

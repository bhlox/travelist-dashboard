import React from "react";
import ClientProfilePage from "./client";
import { getUser } from "@/lib/actions/auth";

export default async function ProfilePage() {
  const user = await getUser();
  return <ClientProfilePage isDev={user?.user?.role === "developer"} />;
}

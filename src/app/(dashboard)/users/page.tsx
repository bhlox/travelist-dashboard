import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function UsersPage() {
  const user = await getUser();
  const isAuthorized =
    user?.user?.role === "developer" || user?.user?.role === "owner";
  if (!isAuthorized) {
    redirect("/");
  }
  return <div>UsersPage</div>;
}

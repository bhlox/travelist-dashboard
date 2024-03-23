"use client";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions/auth";
import React from "react";

export default function ClientHome({
  username,
}: {
  username: string | undefined;
}) {
  return (
    <>
      <p>hello {username}</p>
      <Button onClick={() => logoutUser()}>Logout </Button>
    </>
  );
}

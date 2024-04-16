import React from "react";

import { validateResetPasswordToken } from "@/lib/actions/auth";
import ResetPasswordClient from "./client";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const isTokenValid = await validateResetPasswordToken(searchParams.tk!);

  return <ResetPasswordClient />;
}

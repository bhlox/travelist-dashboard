"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginRandomImagesList } from "@/lib/constants";
import { cn, randomIndexNumber } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import LoginForm from "@/components/forms/login";

export default function Login() {
  const { width } = useWindowSize();
  const [loginImage] = useState(
    () => loginRandomImagesList[randomIndexNumber(loginRandomImagesList.length)]
  );

  return (
    <div className="w-full grid lg:grid-cols-2 place-items-center min-h-[100dvh]">
      <div className="flex items-center justify-center py-6 border px-4 rounded-xl">
        <div className="mx-auto grid w-[350px] gap-6 ">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm/>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-2">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block h-full">
        <Image
          suppressHydrationWarning
          priority={width && width >= 1024 ? true : false}
          src={loginImage}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.6] dark:grayscale-[50%]"
        />
      </div>
    </div>
  );
}

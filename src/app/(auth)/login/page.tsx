"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LOGIN_RNDM_IMG_LIST } from "@/lib/constants";
import { cn, randomIndexNumber } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import LoginForm from "@/components/forms/login";
import { toast } from "react-toastify";
import { loginDemoUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  
  const router = useRouter();
  const { width } = useWindowSize();
  const [loginImage] = useState(
    () => LOGIN_RNDM_IMG_LIST[randomIndexNumber(LOGIN_RNDM_IMG_LIST.length)]
  );

  const handleLoginDemo = async () => {
    try {
      await loginDemoUser();
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again");
    }
  };

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
          <LoginForm />
          <div className="mt-4 text-center text-sm space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-2 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
            <div className="flex items-center gap-2 text-center justify-center">
              <p>Demo testing:</p>
              <button
                type="button"
                onClick={handleLoginDemo}
                className="underline underline-offset-2 hover:text-blue-500"
              >
                Click here
              </button>
            </div>
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

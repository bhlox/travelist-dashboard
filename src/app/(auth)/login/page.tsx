"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginRandomImagesList } from "@/lib/constants";
import { cn, randomIndexNumber } from "@/lib/utils";
import { loginFormSchema } from "@/lib/forms-schema";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/svg/loader";
import { useWindowSize } from "@uidotdev/usehooks";
import { PasswordInput } from "@/components/ui/password-input";
import { FaCheck } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const { width } = useWindowSize();
  const [loginImage] = useState(
    () => loginRandomImagesList[randomIndexNumber(loginRandomImagesList.length)]
  );
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async ({
    password,
    username,
  }: z.infer<typeof loginFormSchema>) => {
    try {
      await loginUser({ password, username });
      setTimeout(() => {
        router.replace("/");
      }, 1000);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline underline-offset-2"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput {...field} placeholder="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={
                  form.formState.isSubmitting ||
                  form.formState.isSubmitSuccessful
                }
                type="submit"
                className={cn(null, null, {
                  "bg-green-700 dark:bg-green-600 flex gap-2":
                    form.formState.isSubmitSuccessful,
                })}
              >
                {form.formState.isSubmitting ? (
                  <LoadingSpinner />
                ) : form.formState.isSubmitSuccessful ? (
                  <>
                    <FaCheck /> <span>Logged in</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                disabled={
                  form.formState.isSubmitting ||
                  form.formState.isSubmitSuccessful
                }
                variant="outline"
                className="w-full"
              >
                Login with Google
              </Button>
            </form>
          </Form>
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

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
export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });
  const onSubmit = async ({
    password,
    usernameOrEmail,
  }: z.infer<typeof loginFormSchema>) => {
    try {
      await loginUser({ password, usernameOrEmail });
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username / Email</FormLabel>
              <FormControl>
                <Input placeholder="username or email" {...field} />
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
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
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
      </form>
    </Form>
  );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/svg/loader";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa";

const passwordFormSchema = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
  });

  const onSubmit = async ({ password }: z.infer<typeof passwordFormSchema>) => {
    const token = searchParams.get("tk");
    await resetPassword({ tk: token!, password });

    toast.success("Password reset success. Redirecting");
    setTimeout(() => {
      router.replace("/");
    }, 1500);
  };

  return (
    <section className="min-h-[100dvh] max-w-2xl mx-auto p-4 grid place-items-center">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password again"
                        {...field}
                      />
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

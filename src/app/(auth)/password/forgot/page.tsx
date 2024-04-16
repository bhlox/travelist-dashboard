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
  FormDescription,
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
import { requestResetPassword } from "@/lib/actions/auth";

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export default function ForgetPasswordPage() {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
  });

  const onSubmit = async ({ email }: z.infer<typeof emailFormSchema>) => {
    const link = await requestResetPassword(email);
    toast.success("Please check your email for password reset link");
  };

  return (
    <section className="min-h-[100dvh] max-w-2xl mx-auto p-4 grid place-items-center">
      <Card>
        <CardHeader>
          <CardTitle>
            {form.formState.isSubmitSuccessful
              ? "Email reset link sent"
              : "Forgot your password?"}{" "}
          </CardTitle>
          <CardDescription>
            {form.formState.isSubmitSuccessful
              ? "A message has been sent. Pls check your inbox."
              : "Enter your email to reset it."}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!form.formState.isSubmitSuccessful ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? <LoadingSpinner /> : "Submit"}
                </Button>
              </form>
            </Form>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

"use client";
import React from "react";
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
import { BsQuestionCircleFill } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createUser, findEmail, findUser } from "@/lib/actions/user";
import { signupFormSchema } from "@/lib/forms-schema";
import { PasswordInput } from "@/components/ui/password-input";
import LoadingSpinner from "@/components/svg/loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      displayname: "",
    },
  });

  const onSubmit = async ({
    password,
    username,
    email,
    displayname,
  }: z.infer<typeof signupFormSchema>) => {
    try {
      const usernameExists = await findUser({ username });
      if (usernameExists) {
        toast.error("Username already exists");
        return form.setError("username", {
          type: "manual",
          message: "Username already exists",
        });
      }
      const emailExists = await findEmail(email);
      if (emailExists) {
        toast.error("Email already exists");
        return form.setError("email", {
          type: "manual",
          message: "Email already exists",
        });
      }
      await createUser({
        hashedPassword: password,
        username,
        displayname,
        email,
      });
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Username</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <BsQuestionCircleFill className="block" />
                    </PopoverTrigger>
                    <PopoverContent side="top">
                      Can be used for login credentials
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayname"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Display name</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <BsQuestionCircleFill className="block" />
                    </PopoverTrigger>
                    <PopoverContent side="top">
                      This is how others will see your name.
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Input placeholder="display name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
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
              <FormLabel>Password</FormLabel>
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
              <FaCheck /> <span>Created</span>
            </>
          ) : (
            "Create an Account"
          )}
        </Button>
      </form>
    </Form>
  );
}

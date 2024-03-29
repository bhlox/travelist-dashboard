"use client";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoles } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ToastContent from "@/components/toast/content";
import { updateUserDetails } from "@/lib/actions/user";
import { PasswordInput } from "@/components/ui/password-input";
import { ProfileFormSchema } from "@/lib/forms-schema";

export default function ClientProfilePage({ isDev }: { isDev: boolean }) {
  const {
    role,
    id: userID,
    username,
    displayname,
    testRole,
  } = useUserDetailsContext();
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: { testRole, username, displayname },
  });

  const onSubmit = async (updates: z.infer<typeof ProfileFormSchema>) => {
    // console.log(updates);
    try {
      await updateUserDetails({
        update: {
          id: userID,
          username: updates.username || username,
          testRole: updates.testRole,
          password: updates.password?.trim() || undefined,
          hashedPassword: updates.newPassword?.trim() || undefined,
          displayname: updates.displayname,
        },
      });
      toast.success(
        <ToastContent title="Profile updated" description={undefined} />
      );
    } catch (error) {
      // #TODO improve toast error message
      console.error(error);
      toast.error(
        <ToastContent title={error.message} description={undefined} />
      );
    }
  };

  if (form.formState.errors) {
    console.log(form.formState.errors);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl md:text-4xl font-bold">Profile settings</h3>
        <p>Only Update the fields you want to change</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="displayname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      onChange={(e) => {
                        if (!e.target.value.trim()) {
                          return field.onChange(undefined);
                        }
                        field.onChange(e.target.value.trim());
                      }}
                      placeholder="enter current password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    onChange={(e) => {
                      if (!e.target.value.trim()) {
                        return field.onChange(undefined);
                      }
                      field.onChange(e.target.value);
                    }}
                    placeholder="enter new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isDev ? (
            <FormField
              control={form.control}
              name="testRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change test role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={role} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["owner", "admin", "staff"].map((role) => (
                        <SelectItem key={`select-${role}`} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

"use client";
import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import React, { ChangeEvent, useEffect } from "react";
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
import { defaultDbProfPicString, userRoles } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ToastContent from "@/components/toast/content";
import { updateUserDetails } from "@/lib/actions/user";
import { PasswordInput } from "@/components/ui/password-input";
import { ProfileFormSchema } from "@/lib/forms-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Headings from "@/components/ui/headings";
import { Textarea } from "@/components/ui/textarea";
import { SelectUser } from "@/lib/types";
import LoadingSpinner from "@/components/svg/loader";
import { getImageData } from "@/lib/utils";
import Image from "next/image";
import { TbFileUpload } from "react-icons/tb";

// #BUG something weird when zooming with scrolls. this only happens here not others pages

export default function ClientProfilePage({
  userDetails,
}: {
  userDetails: Omit<SelectUser, "hashedPassword">;
}) {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const {
    role,
    id: userID,
    username,
    displayname,
    testRole,
  } = useUserDetailsContext();

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      testRole,
      username,
      displayname,
      description: userDetails?.description ?? undefined,
    },
  });

  const onSubmit = async (updates: z.infer<typeof ProfileFormSchema>) => {
    return console.log(updates);
    try {
      await updateUserDetails({
        update: {
          id: userID,
          username: updates.username || username,
          testRole: updates.testRole,
          password: updates.password?.trim() || undefined,
          hashedPassword: updates.newPassword?.trim() || undefined,
          displayname: updates.displayname,
          description: updates?.description,
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

  const profPic =
    userDetails?.profilePicture! === defaultDbProfPicString
      ? `/assets${defaultDbProfPicString}`
      : userDetails?.profilePicture!;

  return (
    <div className="space-y-4">
      <Headings
        title="Profile settings"
        description="Update your profile information"
      />
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Profile Image</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2 space-y-2 flex flex-col justify-center items-center">
            <h3>Current Image</h3>
            <Image
              src={profPic}
              alt="profile image"
              width={200}
              height={200}
              className="rounded-xl"
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:w-1/2 flex flex-col items-center justify-center"
            >
              {previewImage ? (
                <>
                  <p>Preview Image</p>
                  <div className="flex justify-center items-center">
                    <Image
                      src={previewImage}
                      alt="profile image"
                      width={200}
                      height={200}
                      // className="rounded-full"
                    />
                  </div>
                </>
              ) : null}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <Button asChild type="button">
                      <FormLabel
                        htmlFor="profilePicture"
                        className="cursor-pointer"
                      >
                        <TbFileUpload className="text-2xl mr-1" /> choose
                        picture
                      </FormLabel>
                    </Button>
                    <FormControl>
                      <Input
                        id="profilePicture"
                        {...fieldProps}
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(event) => {
                          const { files, displayUrl } = getImageData(event);
                          setPreviewImage(displayUrl);
                          onChange(files);
                          // onChange(event.target.files && event.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? <LoadingSpinner /> : "submit"}
          </Button>
        </CardFooter>
      </Card>
      <div className="flex flex-col md:flex-row justify-between gap-4  max-w-3xl">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Display name</CardTitle>
            <CardDescription>
              This is how other users will view your name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="displayname"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? <LoadingSpinner /> : "submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>Can be used for login credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? <LoadingSpinner /> : "submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
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
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? <LoadingSpinner /> : "submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            This will be displayed on your profile description in the website.
            This is only useful for staff role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your profile description here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? <LoadingSpinner /> : "submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {userDetails.role === "developer" && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Test Role</CardTitle>
            <CardDescription>
              Developer: Only used to test other roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="testRole"
                  render={({ field }) => (
                    <FormItem>
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
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? <LoadingSpinner /> : "submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import LoadingSpinner from "@/components/svg/loader";
import ToastContent from "@/components/toast/content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { updateUserDetails } from "@/lib/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const PasswordFormSchema = z.object({
  password: z.string(),
  newPassword: z.string(),
});

export default function PasswordForm() {
  const { id } = useUserDetailsContext();
  const form = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof PasswordFormSchema>) => {
    try {
      await updateUserDetails({
        update: {
          id,
          password: data.password?.trim(),
          hashedPassword: data.newPassword?.trim(),
        },
      });
      toast.success(
        <ToastContent title="Updated display name" description={undefined} />
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
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
  );
}

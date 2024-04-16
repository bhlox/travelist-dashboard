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
import { Input } from "@/components/ui/input";
import { updateUserDetails } from "@/lib/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const DisplayNameFormShema = z.object({
  displayname: z.string({ invalid_type_error: "Invalid display name" }),
});

export default function DisplayNameForm({
  currentDisplayName,
}: {
  currentDisplayName: string;
}) {
  const { id } = useUserDetailsContext();
  const form = useForm<z.infer<typeof DisplayNameFormShema>>({
    resolver: zodResolver(DisplayNameFormShema),
    defaultValues: { displayname: currentDisplayName },
  });

  const onSubmit = async (data: z.infer<typeof DisplayNameFormShema>) => {
    try {
      await updateUserDetails({
        update: {
          id,
          displayname: data.displayname,
        },
      });
      toast.success(
        <ToastContent title="Updated display name" description={undefined} />
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Display name</CardTitle>
        <CardDescription>
          This is how other users will view your name
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
}

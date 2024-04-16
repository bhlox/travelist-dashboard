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
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { updateUserDetails } from "@/lib/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const DescriptionFormSchema = z.object({
  description: z.string(),
});

export default function DescriptionForm({
  currentDescription,
}: {
  currentDescription: string | null;
}) {
  const { id } = useUserDetailsContext();
  const form = useForm<z.infer<typeof DescriptionFormSchema>>({
    resolver: zodResolver(DescriptionFormSchema),
    defaultValues: { description: currentDescription ?? undefined },
  });

  const onSubmit = async (data: z.infer<typeof DescriptionFormSchema>) => {
    try {
      await updateUserDetails({
        update: {
          id,
          description: data.description,
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
  );
}

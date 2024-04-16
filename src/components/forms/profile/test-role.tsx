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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserDetails } from "@/lib/actions/user";
import { USER_ROLES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const TestRoleFormSchema = z.object({
  testRole: z.enum(USER_ROLES, {
    invalid_type_error: "Invalid user role",
  }),
});

export default function TestRoleForm() {
  const { id, testRole } = useUserDetailsContext();
  const form = useForm<z.infer<typeof TestRoleFormSchema>>({
    resolver: zodResolver(TestRoleFormSchema),
    defaultValues: { testRole },
  });

  const onSubmit = async (data: z.infer<typeof TestRoleFormSchema>) => {
    try {
      await updateUserDetails({
        update: {
          id,
          testRole: data.testRole,
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
        <CardTitle>Test Role</CardTitle>
        <CardDescription>
          Developer: Only used to test other roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="testRole"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={testRole} />
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
  );
}

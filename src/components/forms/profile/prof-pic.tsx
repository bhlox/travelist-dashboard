import { useUserDetailsContext } from "@/components/providers/user-details-provider";
import LoadingSpinner from "@/components/svg/loader";
import ToastContent from "@/components/toast/content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { deleteFile, uploadFile } from "@/lib/actions/supabase";
import { updateUserDetails } from "@/lib/actions/user";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  DEFAULT_DB_PROF_PIC_STRING,
  SIZE_IN_MB,
} from "@/lib/constants";
import { getImageData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { TbFileUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import { z } from "zod";

const ImageFormSchema = z.object({
  profilePicture: z
    .custom<File>()
    .refine((file) => {
      return file !== undefined;
      //   return Array.from(files ?? []).length !== 0;
    }, "Image is required")
    .refine((file) => {
      return SIZE_IN_MB(file?.size) <= MAX_IMAGE_SIZE;
      // return Array.from(files ?? []).every(
      //   (file) => SIZE_IN_MB(file.size) <= MAX_IMAGE_SIZE
      // );
    }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      // return Array.from(files ?? []).every((file) =>
      //   ACCEPTED_IMAGE_TYPES.includes(file.type)
      // );
    }, "File type is not supported"),
});

export default function ProfilePictureForm({
  currentPicture,
}: {
  currentPicture: string;
}) {
  const { id } = useUserDetailsContext();
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const form = useForm<z.infer<typeof ImageFormSchema>>({
    resolver: zodResolver(ImageFormSchema),
  });

  const onSubmit = async ({
    profilePicture,
  }: z.infer<typeof ImageFormSchema>) => {
    try {
      const formData = new FormData();
      formData.append("profile", profilePicture);
      const imagePathName = await uploadFile(formData);
      await updateUserDetails({
        update: {
          id,
          profilePicture: imagePathName,
        },
      });
      await deleteFile(currentPicture);
      toast.success(
        <ToastContent title="Profile updated" description={undefined} />
      );
      setPreviewImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  const profPic =
    currentPicture === DEFAULT_DB_PROF_PIC_STRING
      ? `/assets${DEFAULT_DB_PROF_PIC_STRING}`
      : currentPicture;

  return (
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
                      <TbFileUpload className="text-2xl mr-1" /> Upload
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
                        onChange(files[0]);
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
  );
}

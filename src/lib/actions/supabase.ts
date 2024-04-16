"use server";
import { supabase } from "../config/supabase";
import { splitUrlPath } from "../utils";

export const uploadFile = async (formData: FormData) => {
  const filer = formData.get("profile") as File;
  const { data, error } = await supabase.storage
    .from("profile-images")
    .upload(filer.name, filer);
  if (error) {
    throw new Error(error.message);
  }
  return data.path;
};

export const deleteFile = async (path: string) => {
  const imgPath = splitUrlPath(path);
  const { data, error } = await supabase.storage
    .from("profile-images")
    .remove([imgPath.at(-1)!]);
  if (error) {
    throw new Error(error.message);
  }
};

"use server";
import { db } from "@/db";
import { UpdateUser } from "../types";
import { revalidatePath } from "next/cache";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

export const findUser = async ({ username }: { username: string }) => {
  return await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });
};

export const updateUserDetails = async ({ update }: { update: UpdateUser }) => {
  if (!update.id) throw new Error("No id found for updating user");
  if (update.hashedPassword && !update.password) {
    throw new Error("pls confirm your current password first");
  }
  if (update.password) {
    {
      const hash = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, update.id),
        columns: { hashedPassword: true },
      });
      const isPasswordSame = await new Argon2id().verify(
        hash?.hashedPassword!,
        update.password
      );
      if (!isPasswordSame) {
        throw new Error("Password is not same");
      }
    }
    if (!update.hashedPassword) {
      throw new Error("pls provide your new password");
    }
    update.hashedPassword = await new Argon2id().hash(update.hashedPassword);
  }
  const { id, password, ...values } = update;
  await db.update(user).set(values).where(eq(user.id, update.id));
  revalidatePath("/");
};
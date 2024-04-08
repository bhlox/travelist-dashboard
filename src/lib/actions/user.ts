"use server";
import { db } from "@/db";
import {
  FindUser,
  GlobalSearchUser,
  InsertUser,
  SelectUser,
  UpdateUser,
} from "../types";
import { revalidatePath } from "next/cache";
import { user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia } from "@/auth";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { generateEmailVerificationCode } from "./auth";

export const findUser = async ({ username, email }: FindUser) => {
  if (username) {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.username, username),
      columns: { hashedPassword: false },
    });
  } else if (email) {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
      columns: { hashedPassword: false },
    });
  }
};

export const findEmail = async (email: string) => {
  return await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });
};

export const createUser = async (userDetails: Omit<InsertUser, "id">) => {
  // if (
  //   typeof username !== "string" ||
  //   username.length < 3 ||
  //   username.length > 31 ||
  //   !/^[a-z0-9_-]+$/.test(username)
  // ) {
  //   return {
  //     error: "Invalid username",
  //   };
  // }
  // if (
  //   typeof password !== "string" ||
  //   password.length < 6 ||
  //   password.length > 255
  // ) {
  //   return {
  //     error: "Invalid password",
  //   };
  // }

  const hashedPassword = await new Argon2id().hash(userDetails.hashedPassword);
  const userId = generateId(15);

  await db.insert(user).values({
    id: userId,
    username: userDetails.username,
    hashedPassword,
    displayname: userDetails.displayname,
    email: userDetails.email,
  });
  const verificationCode = await generateEmailVerificationCode({
    userId,
    email: userDetails.email,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
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
      const verifyPassword = await new Argon2id().verify(
        hash?.hashedPassword!,
        update.password
      );
      if (!verifyPassword) {
        throw new Error("Incorrect password");
      }
      if (!update.hashedPassword) {
        throw new Error("Pls provide a password");
      }
      const isNewPasswordSameWithOld = await new Argon2id().verify(
        hash?.hashedPassword!,
        update.hashedPassword
      );
      if (isNewPasswordSameWithOld) {
        throw new Error("New password cannot be same as old password");
      }
    }
    if (!update.hashedPassword) {
      throw new Error("Pls provide a password");
    }
    update.hashedPassword = await new Argon2id().hash(update.hashedPassword);
  }

  const { id, password, ...values } = update;
  await db.update(user).set(values).where(eq(user.id, update.id));
  revalidatePath("/");
};

export const globalSearchUser = async (searchTerm: string) => {
  if (!searchTerm) return [];
  const query = sql`SELECT ${user.id}, ${user.username}, ${
    user.displayname
  } AS displayname, ${user.role} FROM ${user} WHERE ${
    user.username
  } ILIKE ${`%${searchTerm}%`} OR ${
    user.displayname
  } ILIKE ${`%${searchTerm}%`} OR ${user.role} ILIKE ${`%${searchTerm}%`}`;

  const result: GlobalSearchUser[] = await db.execute(query);
  const removeDev = result.filter((data) => data.role !== "developer");
  return removeDev;
};

export const deleteUser = async (id: string) => {
  const deletedUser = await db
    .delete(user)
    .where(eq(user.id, id))
    .returning({ username: user.username });
  revalidatePath("/");
};

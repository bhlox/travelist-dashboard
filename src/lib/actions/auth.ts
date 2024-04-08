"use server";
import { lucia } from "@/auth";
import { db } from "@/db";
import { emailVerificationCodes, user } from "@/db/schema";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { cache } from "react";
import { InsertUser, UpdateUser } from "../types";
import { eq } from "drizzle-orm";
import { findUser } from "./user";
import { isValidEmail } from "../utils";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";

export const loginUser = async ({
  password,
  usernameOrEmail,
}: {
  usernameOrEmail: string;
  password: string;
}) => {
  let user;
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
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const isEmail = isValidEmail(usernameOrEmail);
  if (isEmail) {
    user = await findUser({ email: usernameOrEmail, withPassword: true });
    if (
      !user ||
      !(await new Argon2id().verify((user as any).hashedPassword, password))
    ) {
      throw new Error("Invalid credentials");
    }
  } else {
    user = await findUser({ username: usernameOrEmail, withPassword: true });
    if (
      !user ||
      !(await new Argon2id().verify((user as any).hashedPassword, password))
    ) {
      throw new Error("Invalid credentials");
    }
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

// we should be able to wrap this with `cache()` but given the issues. this won't yet be implemented till it is fix. issue thread: https://github.com/vercel/next.js/issues/62926, https://github.com/vercel/next.js/pull/62821
export const getUser = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return { user, session };
};

export const logoutUser = async () => {
  const result = await getUser();
  if (!result?.session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(result.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
};

export const generateEmailVerificationCode = async ({
  email,
  userId,
}: {
  userId: string;
  email: string;
}): Promise<string> => {
  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, userId));
  const code = generateRandomString(6, alphabet("0-9", "A-Z")); // await db.table("email_verification_code").
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, "m")),
  });
  return code;
};

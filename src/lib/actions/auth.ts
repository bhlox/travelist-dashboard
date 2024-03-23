"use server";

import { lucia } from "@/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { cache } from "react";
import { UpdateUser } from "../types";
import { eq } from "drizzle-orm";
import { findUser } from "./user";

export const signupUser = async ({
  password,
  username,
}: {
  username: string;
  password: string;
}): Promise<{ error: string }> => {
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  await db.insert(user).values({
    id: userId,
    username,
    hashedPassword,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
};

export const loginUser = async ({
  password,
  username,
}: {
  username: string;
  password: string;
}) => {
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const user = await findUser({ username });
  if (!user || !(await new Argon2id().verify(user.hashedPassword, password))) {
    return {
      error: "Invalid username or password",
    };
  }
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  console.log("redirecting to home group pages");
  // return redirect("/");
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

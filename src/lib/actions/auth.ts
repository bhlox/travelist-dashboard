"use server";
import { lucia } from "@/auth";
import { db } from "@/db";
import { emailVerificationCodes, passwordResetTokens, user } from "@/db/schema";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { findUser } from "./user";
import { isValidEmail } from "../utils";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet, sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { headers } from "next/headers";
import transporter from "../config/nodemailer";
import env from "../config/env";

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

export const loginDemoUser = async () => {
  const demoUser = await db
    .select()
    .from(user)
    .where(eq(user.username, "demo"))
    .limit(1)
    .execute();
  if (demoUser.length) {
    const session = await lucia.createSession(demoUser[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
};

export const createPasswordResetToken = async (
  userId: string
): Promise<string> => {
  // optionally invalidate all existing tokens
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
  const tokenId = generateId(40);
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

  await db.insert(passwordResetTokens).values({
    tokenHash,
    userId,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });
  return tokenId;
};

export const requestResetPassword = async (email: string) => {
  const headersList = headers();
  const hostname = headersList.get("x-forwarded-host");
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });
  if (!user) {
    throw new Error("No user found");
  }
  const verificationToken = await createPasswordResetToken(user.id);
  const verificationLink = `${hostname}/password/reset?tk=${verificationToken}`;

  await sendEmailPasswordResetToken({ email, verificationLink });
  return true;
};

export const validateResetPasswordToken = async (tk: string) => {
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tk)));
  const token = await db.query.passwordResetTokens.findFirst({
    where: (token, { eq }) => eq(token.tokenHash, tokenHash),
  });
  if (!token) {
    throw new Error("Invalid token");
  }
  return true;
};

export const resetPassword = async ({
  password,
  tk,
}: {
  password: string;
  tk: string;
}) => {
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tk)));
  const token = await db.query.passwordResetTokens.findFirst({
    where: (token, { eq }) => eq(token.tokenHash, tokenHash),
  });
  if (!token) {
    throw new Error("Invalid token");
  }
  await lucia.invalidateUserSessions(token.userId);
  const hashedPassword = await new Argon2id().hash(password);

  await db
    .update(user)
    .set({ hashedPassword })
    .where(eq(user.id, token.userId));
  const session = await lucia.createSession(token.userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  // return new Response(null, {
  //   status: 302,
  //   headers: {
  //     Location: "/",
  //     "Set-Cookie": sessionCookie.serialize(),
  //     "Referrer-Policy": "no-referrer",
  //   },
  // });
};

export const sendEmailPasswordResetToken = async ({
  email,
  verificationLink,
}: {
  email: string;
  verificationLink: string;
}) => {
  const formattedLink = verificationLink.includes("localhost")
    ? `http://${verificationLink}`
    : `https://${verificationLink}`;
  await transporter.sendMail({
    from: "sender",
    to: email,
    subject: "Password Reset token link",
    html:
      '<p>Click <a href="' +
      formattedLink +
      '">here</a> to reset your password</p>',
  });
};

"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export type FormState = { error?: string; fields?: Record<string, string> } | undefined;

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = signUpSchema.safeParse(raw);
  const fields = { name: raw.name ?? "", email: raw.email ?? "" };
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };

  await connectDB();
  const email = parsed.data.email.toLowerCase();
  if (await User.exists({ email })) {
    return { error: "An account with this email already exists. Try logging in.", fields };
  }
  await User.create({
    name: parsed.data.name,
    email,
    passwordHash: await bcrypt.hash(parsed.data.password, 10),
  });

  // signIn throws a redirect on success, which Next.js handles.
  await signIn("credentials", { email, password: parsed.data.password, redirectTo: "/dashboard" });
}

export async function logInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password") ?? ""),
      redirectTo: String(formData.get("redirectTo") || "/dashboard"),
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Incorrect email or password.", fields: { email } };
    }
    throw err; // re-throw the redirect
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

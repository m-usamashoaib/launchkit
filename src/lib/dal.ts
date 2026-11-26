import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

/** The narrow user shape that pages and components are allowed to see. */
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "user" | "admin";
  plan: "free" | "pro";
  subscriptionStatus: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  hasStripeCustomer: boolean;
  createdAt: Date;
};

/**
 * Data Access Layer: the single place that turns a session into a user.
 * Reads the request (cookies), so callers must render inside <Suspense>.
 */
export async function getOptionalUser(): Promise<CurrentUser | null> {
  // Stop prerendering here: Auth.js uses crypto before it reads the request.
  await connection();
  const session = await auth();
  if (!session?.user?.id) return null;
  await connectDB();
  const u = await User.findById(session.user.id).lean();
  if (!u) return null;
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    image: u.image ?? null,
    role: u.role === "admin" ? "admin" : "user",
    plan: u.plan === "pro" ? "pro" : "free",
    subscriptionStatus: u.subscriptionStatus ?? null,
    currentPeriodEnd: u.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: Boolean(u.cancelAtPeriodEnd),
    hasStripeCustomer: Boolean(u.stripeCustomerId),
    createdAt: u.createdAt,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getOptionalUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { demoBilling, stripe } from "@/lib/stripe";
import { User } from "@/models/User";

async function appUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

/** Starts a Stripe Checkout session for the Pro plan. */
export async function upgradeAction() {
  const user = await requireUser();
  if (user.plan === "pro") redirect("/dashboard/billing");

  if (demoBilling) {
    await connectDB();
    await User.updateOne(
      { _id: user.id },
      { plan: "pro", subscriptionStatus: "active", currentPeriodEnd: new Date(Date.now() + 30 * 86_400_000) },
    );
    redirect("/dashboard/billing?checkout=success");
  }
  if (!stripe || !process.env.STRIPE_PRO_PRICE_ID) throw new Error("Stripe is not configured.");

  await connectDB();
  const dbUser = await User.findById(user.id);
  if (!dbUser) redirect("/login");

  // Reuse one Stripe customer per user.
  let customerId = dbUser.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      name: dbUser.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await User.updateOne({ _id: user.id }, { stripeCustomerId: customerId });
  }

  const base = await appUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
    subscription_data: { metadata: { userId: user.id } },
    allow_promotion_codes: true,
    success_url: `${base}/dashboard/billing?checkout=success`,
    cancel_url: `${base}/dashboard/billing?checkout=canceled`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}

/** Opens the Stripe customer portal to update payment details, view invoices or cancel. */
export async function manageBillingAction() {
  const user = await requireUser();

  if (demoBilling) {
    await connectDB();
    await User.updateOne(
      { _id: user.id },
      { plan: "free", subscriptionStatus: "canceled", currentPeriodEnd: null, cancelAtPeriodEnd: false },
    );
    redirect("/dashboard/billing?checkout=canceled-demo");
  }
  if (!stripe) throw new Error("Stripe is not configured.");

  await connectDB();
  const dbUser = await User.findById(user.id);
  if (!dbUser?.stripeCustomerId) redirect("/dashboard/billing");

  const portal = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${await appUrl()}/dashboard/billing`,
  });
  redirect(portal.url);
}

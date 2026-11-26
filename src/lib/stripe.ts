import "server-only";
import Stripe from "stripe";
import { User } from "@/models/User";

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

/** Without Stripe keys in development, upgrades are simulated so the app stays demo-able. */
export const demoBilling = !stripe && process.env.NODE_ENV !== "production";

const ACTIVE = new Set(["active", "trialing"]);

/** Copies a Stripe subscription's state onto the matching user. Safe to call repeatedly. */
export async function syncSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const periodEnd = sub.items.data[0]?.current_period_end;
  const isActive = ACTIVE.has(sub.status);
  // A scheduled cancellation shows up either as `cancel_at` (a date, which the
  // customer portal sets on current API versions) or as `cancel_at_period_end`.
  const cancelsAt = sub.cancel_at ?? (sub.cancel_at_period_end ? periodEnd : null);
  const accessUntil = cancelsAt ?? periodEnd;

  const update = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    subscriptionStatus: sub.status,
    plan: isActive ? "pro" : "free",
    currentPeriodEnd: accessUntil ? new Date(accessUntil * 1000) : undefined,
    cancelAtPeriodEnd: Boolean(cancelsAt) && isActive,
  } as const;

  const userId = sub.metadata?.userId;
  const res = userId
    ? await User.updateOne({ _id: userId }, update)
    : await User.updateOne({ stripeCustomerId: customerId }, update);
  if (!res.matchedCount) console.warn(`[stripe] no user found for subscription ${sub.id}`);
}

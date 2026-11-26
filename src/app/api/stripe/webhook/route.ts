import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { stripe, syncSubscription } from "@/lib/stripe";

/**
 * Stripe webhook: the source of truth for subscription state.
 * Local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response("Stripe is not configured", { status: 501 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing stripe-signature header", { status: 400 });

  let event: Stripe.Event;
  try {
    // The signature is computed over the raw body, so read it as text.
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch (err) {
    console.error("[stripe] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  await connectDB();
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          await syncSubscription(await stripe.subscriptions.retrieve(subId));
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object);
        break;
      default:
        break; // ignore other events
    }
  } catch (err) {
    console.error(`[stripe] failed to handle ${event.type}`, err);
    return new Response("Webhook handler failed", { status: 500 }); // Stripe will retry
  }

  return Response.json({ received: true });
}

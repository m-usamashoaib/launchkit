import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/dal";
import { stripe, syncSubscription } from "@/lib/stripe";

/**
 * Stripe Checkout redirects here after payment. Syncing now means the user sees
 * Pro immediately, even if the webhook hasn't arrived yet. The webhook stays the
 * source of truth for later changes (renewals, cancellations, failed payments).
 */
export async function GET(request: Request) {
  const user = await getOptionalUser();
  if (!user) redirect("/login");

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!stripe || !sessionId) redirect("/dashboard/billing");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
    // Only sync a session that belongs to the signed-in user.
    if (session.client_reference_id === user.id && session.subscription && typeof session.subscription !== "string") {
      await syncSubscription(session.subscription);
    }
  } catch (err) {
    console.error("[stripe] checkout success sync failed", err); // the webhook will still sync it
  }
  redirect("/dashboard/billing?checkout=success");
}

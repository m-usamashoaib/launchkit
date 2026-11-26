import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, PageSkeleton } from "@/components/page-header";
import { Badge, Card } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { manageBillingAction, upgradeAction } from "@/app/actions/billing";
import { requireUser } from "@/lib/dal";
import { PLANS } from "@/lib/plans";
import { demoBilling } from "@/lib/stripe";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage({ searchParams }: PageProps<"/dashboard/billing">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Billing searchParams={searchParams} />
    </Suspense>
  );
}

const banners: Record<string, { tone: string; text: string }> = {
  success: { tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200", text: "🎉 Payment successful. Welcome to Pro!" },
  canceled: { tone: "border-amber-500/30 bg-amber-500/10 text-amber-200", text: "Checkout canceled. You have not been charged." },
  "canceled-demo": { tone: "border-amber-500/30 bg-amber-500/10 text-amber-200", text: "Demo subscription canceled. You're back on the Free plan." },
};

async function Billing({ searchParams }: { searchParams: PageProps<"/dashboard/billing">["searchParams"] }) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const isPro = user.plan === "pro";
  const banner = typeof params.checkout === "string" ? banners[params.checkout] : undefined;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <PageHeader title="Billing" description="Manage your plan, payment method and invoices." />

      {banner && <p role="status" className={`mb-6 rounded-xl border px-4 py-3 text-sm ${banner.tone}`}>{banner.text}</p>}
      {demoBilling && (
        <p className="mb-6 rounded-xl border border-dashed border-line px-4 py-3 text-xs text-muted">
          <strong className="text-fg">Demo billing mode:</strong> no Stripe keys are set, so upgrades and cancellations are
          simulated. Add <code className="font-mono text-fg">STRIPE_SECRET_KEY</code> to use real Stripe Checkout.
        </p>
      )}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm text-muted">Current plan</p>
            <p className="mt-1 flex items-center gap-3 text-2xl font-bold">
              {PLANS[user.plan].name}
              {user.subscriptionStatus && (
                <Badge tone={isPro ? "success" : "neutral"}>{user.subscriptionStatus}</Badge>
              )}
            </p>
            <p className="mt-2 text-sm text-muted">
              {isPro && user.currentPeriodEnd
                ? user.cancelAtPeriodEnd
                  ? `Cancels on ${fmt(user.currentPeriodEnd)}. You keep Pro until then.`
                  : `Renews on ${fmt(user.currentPeriodEnd)} for $${PLANS.pro.price}/month.`
                : isPro
                  ? "Thanks for supporting the product!"
                  : "Upgrade to unlock advanced analytics and CSV export."}
            </p>
          </div>
          {isPro ? (
            (user.hasStripeCustomer || demoBilling) && (
              <form action={manageBillingAction}>
                <SubmitButton variant="secondary" pendingText="Opening…">
                  {demoBilling ? "Cancel subscription (demo)" : "Manage billing"}
                </SubmitButton>
              </form>
            )
          ) : (
            <form action={upgradeAction}>
              <SubmitButton pendingText="Redirecting to Stripe…">Upgrade to Pro · ${PLANS.pro.price}/mo</SubmitButton>
            </form>
          )}
        </div>
      </Card>

      {!isPro && (
        <Card className="mt-6">
          <h2 className="font-semibold">What you get with Pro</h2>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {PLANS.pro.features.map((f) => (
              <li key={f} className="flex items-center gap-2"><span className="text-brand-400">✓</span>{f}</li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted">Test card: 4242 4242 4242 4242 · any future expiry · any CVC</p>
        </Card>
      )}
    </>
  );
}

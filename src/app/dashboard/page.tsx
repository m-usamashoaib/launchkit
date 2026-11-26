import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader, PageSkeleton } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  const user = await requireUser();
  const isPro = user.plan === "pro";
  const projectLimit = isPro ? "Unlimited" : "3";
  const memberSince = user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]} 👋`}
        description={`Member since ${memberSince}`}
        action={!isPro && <ButtonLink href="/dashboard/billing">Upgrade to Pro</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Current plan</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
            {isPro ? "Pro" : "Free"} <Badge tone={isPro ? "brand" : "neutral"}>{user.subscriptionStatus ?? "active"}</Badge>
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Projects</p>
          <p className="mt-2 text-2xl font-bold">2 <span className="text-base font-normal text-muted">/ {projectLimit}</span></p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Advanced analytics</p>
          <p className="mt-2 text-2xl font-bold">{isPro ? "Unlocked" : "Locked 🔒"}</p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold">Getting started</h2>
        <ol className="mt-4 space-y-3 text-sm">
          {[
            { done: true, text: "Create your account" },
            { done: isPro, text: "Upgrade to Pro with Stripe Checkout", href: "/dashboard/billing" },
            { done: false, text: "Explore advanced analytics", href: "/dashboard/analytics" },
          ].map((step) => (
            <li key={step.text} className="flex items-center gap-3">
              <span className={`grid size-6 place-items-center rounded-full text-xs ${step.done ? "bg-emerald-500/20 text-emerald-300" : "border border-line text-muted"}`}>
                {step.done ? "✓" : ""}
              </span>
              {step.href && !step.done ? (
                <Link href={step.href} className="text-brand-300 hover:text-brand-400">{step.text} →</Link>
              ) : (
                <span className={step.done ? "text-muted line-through" : ""}>{step.text}</span>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}

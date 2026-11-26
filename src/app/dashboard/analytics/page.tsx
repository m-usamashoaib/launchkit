import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, PageSkeleton } from "@/components/page-header";
import { ButtonLink, Card, buttonClass } from "@/components/ui";
import { requireUser } from "@/lib/dal";
import { TOP_SOURCES, WEEKLY_VISITORS } from "@/lib/analytics";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Analytics />
    </Suspense>
  );
}

async function Analytics() {
  const user = await requireUser();

  // Server-side gate: free users never receive the Pro data at all.
  if (user.plan !== "pro") {
    return (
      <>
        <PageHeader title="Advanced analytics" description="A Pro feature" />
        <Card className="relative overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-600/10 to-transparent" aria-hidden />
          <div className="relative py-10">
            <span className="text-4xl" aria-hidden>🔒</span>
            <h2 className="mt-4 text-xl font-semibold">Unlock advanced analytics</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              See weekly traffic, conversion rates and top traffic sources, and export everything to CSV.
            </p>
            <ButtonLink href="/dashboard/billing" className="mt-6">Upgrade to Pro · $19/mo</ButtonLink>
          </div>
        </Card>
      </>
    );
  }

  const max = Math.max(...WEEKLY_VISITORS.map((w) => w.visitors));
  const totalVisitors = WEEKLY_VISITORS.reduce((s, w) => s + w.visitors, 0);
  const totalSignups = WEEKLY_VISITORS.reduce((s, w) => s + w.signups, 0);
  const first = WEEKLY_VISITORS[0].visitors;
  const last = WEEKLY_VISITORS.at(-1)!.visitors;

  return (
    <>
      <PageHeader
        title="Advanced analytics"
        description="Last 8 weeks (sample data)"
        action={<a href="/api/export" className={buttonClass("secondary")} download>⬇ Export CSV</a>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-muted">Visitors</p><p className="mt-2 text-2xl font-bold">{totalVisitors.toLocaleString()}</p></Card>
        <Card><p className="text-sm text-muted">Signups</p><p className="mt-2 text-2xl font-bold">{totalSignups.toLocaleString()}</p></Card>
        <Card>
          <p className="text-sm text-muted">Conversion rate</p>
          <p className="mt-2 text-2xl font-bold">{((totalSignups / totalVisitors) * 100).toFixed(1)}%</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Weekly visitors</h2>
            <span className="text-sm font-medium text-emerald-300">+{Math.round(((last - first) / first) * 100)}%</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2" role="img" aria-label={`Weekly visitors rose from ${first} to ${last} over 8 weeks`}>
            {WEEKLY_VISITORS.map((w) => (
              <div key={w.week} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-muted opacity-0 transition group-hover:opacity-100">{w.visitors}</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 transition group-hover:from-brand-500" style={{ height: `${(w.visitors / max) * 150}px` }} />
                <span className="text-xs text-muted">{w.week}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Top sources</h2>
          <ul className="mt-5 space-y-4">
            {TOP_SOURCES.map((s) => (
              <li key={s.source}>
                <div className="flex justify-between text-sm"><span>{s.source}</span><span className="text-muted">{s.share}%</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${s.share}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

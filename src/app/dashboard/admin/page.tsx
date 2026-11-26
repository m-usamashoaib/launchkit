import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, PageSkeleton } from "@/components/page-header";
import { Avatar } from "@/components/avatar";
import { Badge, Card } from "@/components/ui";
import { requireAdmin } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { PLANS } from "@/lib/plans";
import { User } from "@/models/User";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Admin />
    </Suspense>
  );
}

async function getAdminStats() {
  await connectDB();
  const since = new Date(Date.now() - 30 * 86_400_000);
  const [total, pro, recentSignups, latest] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ plan: "pro" }),
    User.countDocuments({ createdAt: { $gte: since } }),
    User.find().sort({ createdAt: -1 }).limit(20).select("name email image plan role createdAt").lean(),
  ]);
  return { total, pro, recentSignups, mrr: pro * PLANS.pro.price, latest };
}

async function Admin() {
  await requireAdmin(); // non-admins are redirected before any data is read
  const stats = await getAdminStats();
  const conversion = stats.total ? Math.round((stats.pro / stats.total) * 100) : 0;

  const cards = [
    { label: "Total users", value: stats.total.toLocaleString() },
    { label: "Pro subscribers", value: stats.pro.toLocaleString(), hint: `${conversion}% of users` },
    { label: "MRR", value: `$${stats.mrr.toLocaleString()}`, hint: "Monthly recurring revenue" },
    { label: "New users (30d)", value: stats.recentSignups.toLocaleString() },
  ];

  return (
    <>
      <PageHeader title="Admin" description="Visible to admins only." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
            {c.hint && <p className="mt-1 text-xs text-muted">{c.hint}</p>}
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <h2 className="border-b border-line px-6 py-4 font-semibold">Latest users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted uppercase">
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-3 font-medium">User</th>
                <th scope="col" className="px-6 py-3 font-medium">Plan</th>
                <th scope="col" className="px-6 py-3 font-medium">Role</th>
                <th scope="col" className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.latest.map((u) => (
                <tr key={u._id.toString()} className="border-b border-line/60 last:border-0 hover:bg-line/20">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} image={u.image} size={28} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3"><Badge tone={u.plan === "pro" ? "brand" : "neutral"}>{u.plan}</Badge></td>
                  <td className="px-6 py-3 text-muted capitalize">{u.role}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-muted">
                    {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

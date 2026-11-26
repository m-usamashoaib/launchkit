import { Suspense } from "react";
import { SidebarNav, type NavItem } from "@/components/sidebar";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { signOutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/dal";

const baseItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈", badge: "Pro" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
];

/** Reads the session, so it renders behind the Suspense boundary below. */
async function UserSidebar() {
  const user = await requireUser();
  const items = user.role === "admin" ? [...baseItems, { href: "/dashboard/admin", label: "Admin", icon: "🛡️" }] : baseItems;
  return (
    <SidebarNav
      items={items}
      footer={
        <div className="rounded-xl border border-line p-3">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} image={user.image} size={32} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Badge tone={user.plan === "pro" ? "brand" : "neutral"}>{user.plan === "pro" ? "Pro plan" : "Free plan"}</Badge>
            <form action={signOutAction}>
              <SubmitButton variant="ghost" className="px-2 py-1 text-xs">Sign out</SubmitButton>
            </form>
          </div>
        </div>
      }
    />
  );
}

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:py-10">
      <aside className="md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:w-56 md:shrink-0">
        <Suspense fallback={<SidebarNav items={baseItems} />}>
          <UserSidebar />
        </Suspense>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

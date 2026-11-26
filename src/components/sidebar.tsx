"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type NavItem = { href: string; label: string; icon: string; badge?: string };

export function SidebarNav({ items, footer }: { items: NavItem[]; footer?: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col gap-4 md:gap-6">
      <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Dashboard">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-brand-500/15 text-fg" : "text-muted hover:bg-line/50 hover:text-fg"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-bold text-brand-300 uppercase">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      {footer && <div className="md:mt-auto">{footer}</div>}
    </div>
  );
}

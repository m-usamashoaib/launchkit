import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 disabled:cursor-not-allowed";
const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-500 shadow-sm shadow-brand-900/30",
  secondary: "border border-line bg-surface text-fg hover:border-brand-500/60",
  ghost: "text-muted hover:text-fg",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-surface p-6 ${className}`}>{children}</div>;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "brand" | "success" | "warning"; children: ReactNode }) {
  const tones = {
    neutral: "bg-line/60 text-muted",
    brand: "bg-brand-500/15 text-brand-300",
    success: "bg-emerald-500/15 text-emerald-300",
    warning: "bg-amber-500/15 text-amber-300",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-line/60 ${className}`} />;
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-fg">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M5 15c-1 2-1 4-1 5 1 0 3 0 5-1m6-14c3-1 5-1 5-1s0 2-1 5l-6 6-4-4 6-6zM9 11l-3 1-2 3 4 1m6-1-1 3-3 2-1-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      LaunchKit
    </Link>
  );
}

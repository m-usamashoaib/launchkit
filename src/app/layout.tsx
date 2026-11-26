import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Link from "next/link";
import { Logo, Skeleton } from "@/components/ui";
import { NavAuth } from "@/components/nav-auth";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${siteConfig.name}: SaaS starter with Stripe`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Logo />
            <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
              <Link href="/#features" className="hover:text-fg">Features</Link>
              <Link href="/#pricing" className="hover:text-fg">Pricing</Link>
              <a href={siteConfig.repoUrl} className="hover:text-fg" target="_blank" rel="noopener">GitHub</a>
            </nav>
            {/* Reads the session, so it streams in behind a boundary (Cache Components). */}
            <Suspense fallback={<Skeleton className="h-9 w-40" />}>
              <NavAuth />
            </Suspense>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}

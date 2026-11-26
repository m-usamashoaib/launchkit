import { ButtonLink } from "@/components/ui";
import { PricingCards } from "@/components/pricing-cards";
import { siteConfig } from "@/lib/config";

const features = [
  { title: "Authentication", text: "Email/password and Google sign-in with Auth.js. Passwords hashed with bcrypt, sessions in signed JWTs.", icon: "🔐" },
  { title: "Stripe subscriptions", text: "Checkout, a customer billing portal and verified webhooks that keep every user's plan in sync.", icon: "💳" },
  { title: "Plan-gated features", text: "Pro features are checked on the server, in pages and in API routes, never just hidden in the UI.", icon: "🔒" },
  { title: "Admin dashboard", text: "Users, plans, signups and monthly recurring revenue (MRR) at a glance. Admins only.", icon: "📊" },
  { title: "Next.js 16 + TypeScript", text: "App Router, Server Actions, Cache Components with streaming, and end-to-end types.", icon: "⚡" },
  { title: "Zero-setup local dev", text: "No database? It starts an in-memory MongoDB with demo accounts, so you can run it in one command.", icon: "🧪" },
];

const stack = ["Next.js 16", "React 19", "TypeScript", "MongoDB", "Mongoose", "Auth.js", "Stripe", "Tailwind CSS", "Zod"];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Open source · MIT licensed
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Ship your SaaS in days,{" "}
            <span className="bg-gradient-to-r from-brand-400 to-fuchsia-400 bg-clip-text text-transparent">not months</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted">
            A production-ready starter with authentication, Stripe subscriptions, plan-gated features and an admin
            dashboard. Built with Next.js 16, TypeScript and MongoDB.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" className="px-6 py-3">Try the live demo</ButtonLink>
            <ButtonLink href={siteConfig.repoUrl} variant="secondary" className="px-6 py-3" target="_blank" rel="noopener">
              View source on GitHub
            </ButtonLink>
          </div>
          <ul className="mt-12 flex flex-wrap justify-center gap-2" aria-label="Tech stack">
            {stack.map((s) => (
              <li key={s} className="rounded-md border border-line bg-surface/70 px-2.5 py-1 font-mono text-xs text-muted">{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything a paid product needs</h2>
          <p className="mt-3 text-muted">The boring-but-critical parts are done, so you can focus on what makes your product unique.</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-surface p-6">
              <span className="text-2xl" aria-hidden>{f.icon}</span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-line/70 px-4 py-20 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="mt-3 text-muted">Start free. Upgrade when you need more. Cancel anytime from the billing portal.</p>
        </div>
        <PricingCards />
        <p className="mt-8 text-center text-xs text-muted">Demo uses Stripe test mode. Pay with card 4242 4242 4242 4242, any future date and any CVC.</p>
      </section>

      <footer className="border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
          <p>© {siteConfig.name}. Built by <a href={siteConfig.authorUrl} className="text-fg hover:text-brand-300">{siteConfig.authorName}</a>.</p>
          <a href={siteConfig.repoUrl} className="hover:text-fg">Source on GitHub ↗</a>
        </div>
      </footer>
    </main>
  );
}

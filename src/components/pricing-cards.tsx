import { PLANS } from "@/lib/plans";
import { ButtonLink, Card } from "./ui";

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-brand-400" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
    </svg>
  );
}

export function PricingCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
      {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((id) => {
        const plan = PLANS[id];
        const featured = id === "pro";
        return (
          <Card key={id} className={`relative flex flex-col ${featured ? "border-brand-500/60 shadow-xl shadow-brand-900/20" : ""}`}>
            {featured && (
              <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Most popular</span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted">{plan.description}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
              <span className="text-sm text-muted">/month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2"><Check />{f}</li>
              ))}
            </ul>
            <ButtonLink href="/signup" variant={featured ? "primary" : "secondary"} className="mt-8 w-full">
              {featured ? "Start with Pro" : "Get started free"}
            </ButtonLink>
          </Card>
        );
      })}
    </div>
  );
}

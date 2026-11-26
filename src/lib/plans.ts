export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    description: "Everything you need to try the product.",
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
  },
  pro: {
    name: "Pro",
    price: 19,
    description: "For professionals who need more power.",
    features: ["Unlimited projects", "Advanced analytics", "Priority email support", "Export to CSV"],
  },
} as const;

export type PlanId = keyof typeof PLANS;

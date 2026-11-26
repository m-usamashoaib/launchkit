export const siteConfig = {
  name: "LaunchKit",
  description: "A production-ready SaaS starter: auth, Stripe subscriptions, a dashboard and an admin panel.",
  repoUrl: "https://github.com/m-usamashoaib/launchkit",
  authorName: "Muhammad Usama Shoaib",
  authorUrl: "https://m-usamashoaib.github.io",
};

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/** True when running on the zero-setup in-memory database (shows demo logins). */
export const demoDatabase = !process.env.MONGODB_URI && process.env.NODE_ENV !== "production";

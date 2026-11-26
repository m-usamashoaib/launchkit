# LaunchKit · SaaS starter with Stripe subscriptions

A production-ready SaaS starter: authentication, Stripe subscriptions, plan-gated features and an admin dashboard, built with **Next.js 16, TypeScript and MongoDB**.

**🔗 Live demo:** [launchkit-ten-delta.vercel.app](https://launchkit-ten-delta.vercel.app) · **👤 Author:** [Muhammad Usama Shoaib](https://m-usamashoaib.github.io)

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248) ![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-635bff) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Authentication:** email/password (bcrypt-hashed) and optional Google sign-in with Auth.js v5, using JWT sessions
- **Stripe subscriptions:** Checkout for upgrades, the customer billing portal for cards, invoices and cancellations, and **signature-verified webhooks** as the source of truth for each user's plan
- **Plan-gated features:** Pro-only pages and API routes are checked **on the server** (`/dashboard/analytics`, `/api/export`), not just hidden in the UI
- **Admin dashboard:** total users, Pro subscribers, MRR, new signups and a users table, visible to admins only
- **Next.js 16 patterns:** App Router, Server Actions, `useActionState` forms, and Cache Components with streaming (static shell plus session-dependent UI behind `<Suspense>`)
- **Data Access Layer:** one server-only module (`src/lib/dal.ts`) turns a session into a narrow user object, so pages never touch raw session or database data
- **Zero-setup local dev:** with no `MONGODB_URI` set, an in-memory MongoDB starts with seeded demo accounts; with no Stripe keys, upgrades are simulated

## Tech stack

Next.js 16 · React 19 · TypeScript · MongoDB + Mongoose · Auth.js v5 · Stripe · Tailwind CSS v4 · Zod

## How billing works

```
User clicks "Upgrade"          Stripe Checkout             Stripe webhook
  ──► upgradeAction()  ──►  hosted payment page  ──►  POST /api/stripe/webhook
      (creates/reuses a        (test card 4242…)          verifies signature,
       Stripe customer)                                  syncSubscription(sub)
                                                         ──► user.plan = "pro"
```

- `checkout.session.completed` and `customer.subscription.created|updated|deleted` all go through one idempotent `syncSubscription()` function.
- The JWT holds only the user id. Plan and role are read from the database on every request, so a webhook takes effect immediately without re-login.
- "Manage billing" opens the Stripe customer portal (update card, view invoices, cancel).

## Getting started

```bash
git clone https://github.com/m-usamashoaib/launchkit.git
cd launchkit
npm install
cp .env.example .env.local   # then set AUTH_SECRET (run: npx auth secret)
npm run dev
```

Open http://localhost:3000. With no database configured, log in with a demo account:

| Email | Password | Role |
|---|---|---|
| `demo@launchkit.dev` | `demo12345` | Free user |
| `admin@launchkit.dev` | `admin12345` | Admin (Pro) |

> The first run downloads a MongoDB binary (about 780 MB) for the in-memory database. Set `MONGODB_URI` to skip it.

### Connect real services (optional)

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | Free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | [Google Cloud console](https://console.cloud.google.com/apis/credentials), redirect URI `http://localhost:3000/api/auth/callback/google` |
| `STRIPE_SECRET_KEY` | [Stripe test API keys](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_PRO_PRICE_ID` | Create a product with a $19/month recurring price in Stripe and copy its price id |
| `STRIPE_WEBHOOK_SECRET` | Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` |

To make a user an admin: `db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })`.

## Project structure

```
src/
├─ auth.ts                    Auth.js config (credentials + Google)
├─ app/
│  ├─ page.tsx                Landing page with features and pricing
│  ├─ (auth)/login, signup    Auth pages (Server Actions + useActionState)
│  ├─ dashboard/              Overview, analytics (Pro), billing, admin
│  ├─ actions/                Server Actions: auth and billing
│  └─ api/
│     ├─ stripe/webhook/      Verified Stripe webhook
│     └─ export/              Pro-only CSV export
├─ lib/
│  ├─ dal.ts                  Data Access Layer (session to user, guards)
│  ├─ db.ts                   Mongo connection (+ in-memory dev fallback)
│  ├─ stripe.ts               Stripe client + subscription sync
│  └─ plans.ts                Plan definitions
└─ models/User.ts             Mongoose user model
```

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the environment variables above (a real `MONGODB_URI` is required in production).
3. In Stripe, add a webhook endpoint `https://<your-domain>/api/stripe/webhook` for the `checkout.session.completed` and `customer.subscription.*` events, and set `STRIPE_WEBHOOK_SECRET`.

## License

MIT

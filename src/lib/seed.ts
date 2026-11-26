import "server-only";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

/** Demo accounts for the zero-setup in-memory database (development only). */
export const DEMO_ACCOUNTS = [
  { name: "Demo User", email: "demo@launchkit.dev", password: "demo12345", role: "user", plan: "free" },
  { name: "Admin", email: "admin@launchkit.dev", password: "admin12345", role: "admin", plan: "pro" },
] as const;

const SAMPLE_USERS = [
  ["Ayesha Khan", "pro"], ["Bilal Ahmed", "free"], ["Sara Malik", "pro"], ["Omar Farooq", "free"],
  ["Hina Raza", "free"], ["Daniel Lee", "pro"], ["Maria Garcia", "free"], ["Tom Becker", "free"],
] as const;

export async function seedDemoData() {
  if (await User.estimatedDocumentCount()) return;
  const now = Date.now();
  await User.insertMany([
    ...(await Promise.all(
      DEMO_ACCOUNTS.map(async ({ password, ...a }) => ({ ...a, passwordHash: await bcrypt.hash(password, 10) })),
    )),
    ...SAMPLE_USERS.map(([name, plan], i) => ({
      name,
      email: `${name.split(" ")[0].toLowerCase()}@example.com`,
      plan,
      subscriptionStatus: plan === "pro" ? "active" : undefined,
      createdAt: new Date(now - (i + 1) * 3.5 * 86_400_000),
    })),
  ]);
}

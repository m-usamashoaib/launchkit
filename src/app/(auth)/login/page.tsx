import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";
import { demoDatabase, googleEnabled } from "@/lib/config";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-center text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 mb-8 text-center text-sm text-muted">Log in to your dashboard</p>
      <Card>
        <LoginForm googleEnabled={googleEnabled} />
      </Card>
      {demoDatabase && (
        <div className="mt-6 rounded-xl border border-dashed border-line p-4 text-xs text-muted">
          <p className="font-semibold text-fg">Demo accounts (local in-memory database)</p>
          <p className="mt-2 font-mono">demo@launchkit.dev / demo12345 <span className="text-muted/70">(Free)</span></p>
          <p className="font-mono">admin@launchkit.dev / admin12345 <span className="text-muted/70">(Admin, Pro)</span></p>
        </div>
      )}
    </>
  );
}

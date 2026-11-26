import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";
import { googleEnabled } from "@/lib/config";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="text-center text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 mb-8 text-center text-sm text-muted">Free forever. Upgrade to Pro anytime.</p>
      <Card>
        <SignUpForm googleEnabled={googleEnabled} />
      </Card>
    </>
  );
}

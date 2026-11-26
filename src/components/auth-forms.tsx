"use client";

import Link from "next/link";
import { useActionState } from "react";
import { googleSignInAction, logInAction, signUpAction } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {message}
    </p>
  );
}

function GoogleButton() {
  return (
    <form action={googleSignInAction}>
      <SubmitButton variant="secondary" className="w-full">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12Z" />
        </svg>
        Continue with Google
      </SubmitButton>
    </form>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, action] = useActionState(logInAction, undefined);
  return (
    <div className="space-y-5">
      {googleEnabled && (<><GoogleButton /><Divider /></>)}
      <form action={action} className="space-y-4">
        <ErrorMessage message={state?.error} />
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} placeholder="you@company.com" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </label>
        <SubmitButton className="w-full" pendingText="Logging in…">Log in</SubmitButton>
      </form>
      <p className="text-center text-sm text-muted">
        No account yet? <Link href="/signup" className="font-medium text-brand-300 hover:text-brand-400">Sign up free</Link>
      </p>
    </div>
  );
}

export function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, action] = useActionState(signUpAction, undefined);
  return (
    <div className="space-y-5">
      {googleEnabled && (<><GoogleButton /><Divider /></>)}
      <form action={action} className="space-y-4">
        <ErrorMessage message={state?.error} />
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Name</span>
          <input name="name" autoComplete="name" required minLength={2} defaultValue={state?.fields?.name} placeholder="Jane Doe" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} placeholder="you@company.com" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Password</span>
          <input name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        </label>
        <SubmitButton className="w-full" pendingText="Creating account…">Create account</SubmitButton>
      </form>
      <p className="text-center text-sm text-muted">
        Already have an account? <Link href="/login" className="font-medium text-brand-300 hover:text-brand-400">Log in</Link>
      </p>
    </div>
  );
}

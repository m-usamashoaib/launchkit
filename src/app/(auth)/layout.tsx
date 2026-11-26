export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" aria-hidden />
      <div className="relative w-full max-w-sm">{children}</div>
    </main>
  );
}

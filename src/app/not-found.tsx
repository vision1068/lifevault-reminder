import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-[32px] border bg-[var(--card)] p-8 text-center shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-foreground)]">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-[var(--muted-foreground)]">That page doesn’t exist or you may not have access to it.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, CalendarRange, Grid2x2, FolderCog, LayoutDashboard, Plus } from "lucide-react";

import { logoutAction } from "@/app/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reminders", label: "Reminders", icon: BellRing },
  { href: "/calendar", label: "Calendar", icon: CalendarRange },
  { href: "/categories", label: "Categories", icon: Grid2x2 },
  { href: "/settings", label: "Settings", icon: FolderCog }
];

export function AppShell({
  children,
  userName
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 md:px-6">
      <aside className="hidden w-72 shrink-0 lg:block">
        <Card className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col justify-between p-5">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">LifeVault</p>
              <h1 className="mt-2 text-2xl font-semibold">Reminder</h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Track every important date before it becomes urgent.
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href as LinkProps<string>["href"]}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="rounded-3xl bg-[var(--secondary)] p-4">
              <p className="text-sm text-[var(--muted-foreground)]">Signed in as</p>
              <p className="font-semibold">{userName}</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <form action={logoutAction} className="flex-1">
                <Button className="w-full" variant="outline">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-4">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">Welcome back</p>
            <h2 className="text-2xl font-semibold">{userName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/reminders/new">
                <Plus className="size-4" />
                Quick add
              </Link>
            </Button>
          </div>
        </header>

        {children}
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[28px] border bg-[var(--card)] p-2 shadow-2xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href as LinkProps<string>["href"]}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium",
                  active ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--muted-foreground)]"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

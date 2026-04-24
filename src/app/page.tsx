import Link from "next/link";
import { ArrowRight, BellRing, CalendarClock, Car, CreditCard, HeartPulse, IdCard, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  { label: "Track passport expiry", icon: IdCard },
  { label: "Track Qatar ID expiry", icon: ShieldCheck },
  { label: "Track car insurance", icon: Car },
  { label: "Track birthdays", icon: Sparkles },
  { label: "Track school fee", icon: CreditCard },
  { label: "Track medical appointments", icon: HeartPulse },
  { label: "Track subscriptions", icon: BellRing }
];

export default function LandingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6">
      <section className="grid min-h-[84vh] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur dark:bg-slate-900/70">
            LifeVault Reminder
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-foreground)]">App tagline</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-tight md:text-6xl">
              Track every important date before it becomes urgent.
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted-foreground)]">
              A premium reminder workspace for family, personal, vehicle, document, bill, birthday, event, and custom life admin.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border bg-white/70 p-4 backdrop-blur dark:bg-slate-900/60">
                  <div className="rounded-2xl bg-[var(--accent)] p-2">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b bg-gradient-to-br from-teal-500/15 via-white to-sky-500/10 p-6 dark:from-teal-500/10 dark:via-slate-950 dark:to-sky-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Mobile preview</p>
                <h2 className="text-xl font-semibold">Your reminder pulse</h2>
              </div>
              <CalendarClock className="size-5" />
            </div>
          </div>
          <CardContent className="space-y-4 p-6">
            {[
              ["Passport expiry", "Due in 28 days", "warning"],
              ["Car insurance", "Renewal in 7 days", "destructive"],
              ["Birthday reminder", "Today", "success"],
              ["Home internet bill", "Due in 2 days", "info"]
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-2xl border bg-[var(--secondary)] p-4">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

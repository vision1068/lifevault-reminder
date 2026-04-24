import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  href,
  label,
  value,
  hint,
  accent
}: {
  href: ComponentProps<typeof Link>["href"];
  label: string;
  value: number;
  hint: string;
  accent: string;
}) {
  return (
    <Link href={href}>
      <Card className={cn("h-full transition-transform duration-200 hover:-translate-y-0.5", accent)}>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
            <ArrowRight className="size-4 opacity-70" />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

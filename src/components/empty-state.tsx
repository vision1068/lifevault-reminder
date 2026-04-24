import Link from "next/link";
import type { ComponentProps } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
    description: string;
  actionHref?: ComponentProps<typeof Link>["href"];
  actionLabel?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center">
        <div className="rounded-full bg-[var(--accent)] p-4">
          <Plus className="size-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-md">{description}</CardDescription>
      </CardHeader>
      {actionHref && actionLabel ? (
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}

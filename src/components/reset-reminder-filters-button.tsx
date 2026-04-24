"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ResetReminderFiltersButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      className="flex-1"
      onClick={() => router.push("/reminders")}
    >
      Reset
    </Button>
  );
}

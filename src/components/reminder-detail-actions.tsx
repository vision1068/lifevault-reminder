"use client";

import Link from "next/link";
import { ReminderStatus } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { setReminderStatusAction } from "@/app/actions";
import { DeleteReminderButton } from "@/components/delete-reminder-button";
import { RenewDialog } from "@/components/renew-dialog";
import { Button } from "@/components/ui/button";

export function ReminderDetailActions({ reminderId }: { reminderId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    router.prefetch("/reminders");
  }, [router]);

  function markCompleted() {
    startTransition(async () => {
      const result = await setReminderStatusAction(reminderId, ReminderStatus.COMPLETED);

      if (!result.success) {
        toast.error(result.message ?? "We couldn't update that reminder right now.");
        return;
      }

      router.replace("/reminders");
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild>
        <Link href={`/reminders/${reminderId}/edit`}>Edit</Link>
      </Button>
      <Button variant="secondary" disabled={isPending} onClick={markCompleted}>
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Completing...
          </>
        ) : (
          "Mark as completed"
        )}
      </Button>
      <RenewDialog reminderId={reminderId} />
      <DeleteReminderButton reminderId={reminderId} redirectTo="/reminders" />
    </div>
  );
}

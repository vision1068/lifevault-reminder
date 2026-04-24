"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { deleteReminderByIdAction } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogCancelButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteReminderButton({
  reminderId,
  redirectTo = "/reminders"
}: {
  reminderId: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    router.prefetch(redirectTo);
  }, [redirectTo, router]);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteReminderByIdAction(reminderId);

      if (!result.success) {
        toast.error(result.message ?? "We couldn't delete that reminder right now.");
        return;
      }

      router.replace(redirectTo);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this reminder?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. If you continue, the reminder will be removed and you will return to All reminders.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancelButton disabled={isPending}>Cancel</AlertDialogCancelButton>
          <Button disabled={isPending} onClick={handleDelete} type="button" variant="destructive">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

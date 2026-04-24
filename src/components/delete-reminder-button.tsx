"use client";

import { deleteReminderAction } from "@/app/actions";
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
          <AlertDialogCancelButton>Cancel</AlertDialogCancelButton>
          <form action={deleteReminderAction.bind(null, reminderId, redirectTo)}>
            <Button type="submit" variant="destructive">
              Yes, delete
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

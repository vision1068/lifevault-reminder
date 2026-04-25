"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { sendMyDueReminderEmailsAction, updateNotificationSettingsAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_TIMEZONE_OPTIONS } from "@/lib/constants";

export function NotificationSettingsForm({
  email,
  emailEnabled,
  emailReminderTime,
  emailTimeZone
}: {
  email: string;
  emailEnabled: boolean;
  emailReminderTime: string;
  emailTimeZone: string;
}) {
  const [state, formAction] = useActionState(updateNotificationSettingsAction, {});
  const [sendState, sendAction, sendPending] = useActionState(sendMyDueReminderEmailsAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (sendState.success) {
      toast.success(sendState.message);
    } else if (sendState.message) {
      toast.error(sendState.message);
    }
  }, [sendState]);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">Email reminders</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Send general reminder emails to <strong>{email}</strong> whenever a reminder reaches one of its
                configured reminder days.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-[var(--secondary)] px-3 py-2 text-sm font-medium">
              <input
                type="checkbox"
                name="emailEnabled"
                defaultChecked={emailEnabled}
                className="size-4 accent-[var(--primary)]"
              />
              Enabled
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Daily check time</span>
            <input
              type="time"
              name="emailReminderTime"
              defaultValue={emailReminderTime}
              step="300"
              className="h-11 w-full rounded-2xl border bg-transparent px-4 outline-none ring-0"
            />
            <p className="text-xs text-[var(--muted-foreground)]">Default: 12:00 PM. The scheduler checks every 5 minutes.</p>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Timezone</span>
            <select
              name="emailTimeZone"
              defaultValue={emailTimeZone}
              className="h-11 w-full rounded-2xl border bg-transparent px-4 outline-none ring-0"
            >
              {NOTIFICATION_TIMEZONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--muted-foreground)]">Your reminder emails will use this local time.</p>
          </label>
        </div>

        <SubmitButton>Save notification settings</SubmitButton>
      </form>

      <form action={sendAction} className="rounded-2xl border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Send a test check now</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Run your due-reminder email check immediately for this account. This only sends emails if one of your
              reminders matches today&apos;s reminder timing.
            </p>
          </div>
          <Button type="submit" variant="secondary" disabled={sendPending}>
            {sendPending ? "Checking..." : "Run email check"}
          </Button>
        </div>
      </form>
    </div>
  );
}

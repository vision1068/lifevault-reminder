"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { updateNotificationSettingsAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

export function NotificationSettingsForm({
  email,
  emailEnabled
}: {
  email: string;
  emailEnabled: boolean;
}) {
  const [state, formAction] = useActionState(updateNotificationSettingsAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="rounded-2xl border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Email reminders</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Send general reminder emails to <strong>{email}</strong> whenever a reminder reaches one of its configured reminder days.
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

      <SubmitButton>Save notification settings</SubmitButton>
    </form>
  );
}

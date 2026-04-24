"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { saveReminderAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DATE_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  REMINDER_BEFORE_OPTIONS,
  REPEAT_OPTIONS,
  STATUS_OPTIONS
} from "@/lib/constants";

type ReminderFormProps = {
  categories: { id: string; name: string }[];
  reminder?: {
    id: string;
    title: string;
    categoryId: string;
    personName: string | null;
    vehicleName: string | null;
    mainDate: string;
    dateType: string;
    reminderBeforeDays: number[];
    repeat: string;
    priority: string;
    status: string;
    notes: string | null;
    amount: number | null;
  };
};

export function ReminderForm({ categories, reminder }: ReminderFormProps) {
  const [state, formAction] = useActionState(saveReminderAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5 rounded-[28px] border bg-[var(--card)] p-5 shadow-sm">
        <input name="id" type="hidden" defaultValue={reminder?.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={reminder?.title} placeholder="Passport expiry" />
            <FormMessage message={state.errors?.title?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={reminder?.categoryId}
              className="h-11 w-full rounded-2xl border bg-[var(--input)] px-4 text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FormMessage message={state.errors?.categoryId?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateType">Date type</Label>
            <select
              id="dateType"
              name="dateType"
              defaultValue={reminder?.dateType ?? "EXPIRY_DATE"}
              className="h-11 w-full rounded-2xl border bg-[var(--input)] px-4 text-sm"
            >
              {DATE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainDate">Main date</Label>
            <Input id="mainDate" name="mainDate" type="date" defaultValue={reminder?.mainDate} />
            <FormMessage message={state.errors?.mainDate?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personName">Person name</Label>
            <Input id="personName" name="personName" defaultValue={reminder?.personName ?? ""} placeholder="Optional" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleName">Vehicle name</Label>
            <Input id="vehicleName" name="vehicleName" defaultValue={reminder?.vehicleName ?? ""} placeholder="Optional" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" min="0" defaultValue={reminder?.amount ?? ""} placeholder="Optional amount" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={reminder?.notes ?? ""} placeholder="Anything helpful for later" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[28px] border bg-[var(--card)] p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Reminder timing</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Choose the lead times for in-app alerts.</p>
          <div className="mt-4 space-y-3">
            {REMINDER_BEFORE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-3 rounded-2xl border p-3">
                <Checkbox
                  name="reminderBeforeDays"
                  value={option.value}
                  defaultChecked={reminder?.reminderBeforeDays?.includes(option.value) ?? option.value === 7}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
            <div className="space-y-2">
              <Label htmlFor="customReminderDays">Custom number of days before</Label>
              <Input id="customReminderDays" name="customReminderDays" type="number" min="1" max="365" placeholder="Example: 45" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border bg-[var(--card)] p-5 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                defaultValue={reminder?.priority ?? "MEDIUM"}
                className="h-11 w-full rounded-2xl border bg-[var(--input)] px-4 text-sm"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={reminder?.status ?? "ACTIVE"}
                className="h-11 w-full rounded-2xl border bg-[var(--input)] px-4 text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeat">Repeat</Label>
              <select
                id="repeat"
                name="repeat"
                defaultValue={reminder?.repeat ?? "NONE"}
                className="h-11 w-full rounded-2xl border bg-[var(--input)] px-4 text-sm"
              >
                {REPEAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SubmitButton className="flex-1">{reminder ? "Save changes" : "Save reminder"}</SubmitButton>
          <Link
            href={reminder ? `/reminders/${reminder.id}` : "/reminders"}
            className="inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-semibold"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

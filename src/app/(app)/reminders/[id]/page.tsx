import { format } from "date-fns";
import { notFound } from "next/navigation";

import { PriorityBadge } from "@/components/priority-badge";
import { ReminderDetailActions } from "@/components/reminder-detail-actions";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getReminderMetrics } from "@/lib/date-utils";
import { db } from "@/lib/db";
import { currency } from "@/lib/utils";

export default async function ReminderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const reminder = await db.reminderItem.findFirst({
    where: { id, userId: user.id },
    include: {
      category: true,
      renewalHistoryEntries: {
        orderBy: { renewedOn: "desc" }
      }
    }
  });

  if (!reminder) notFound();

  const metrics = getReminderMetrics(reminder.mainDate, reminder.status);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-2xl">{reminder.title}</CardTitle>
            <StatusBadge status={reminder.status} mainDate={reminder.mainDate} />
            <PriorityBadge priority={reminder.priority} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Category" value={reminder.category.name} />
            <DetailItem label="Main date" value={format(reminder.mainDate, "dd MMM yyyy")} />
            <DetailItem label="Days remaining" value={`${metrics.daysRemaining}`} />
            <DetailItem label="Amount" value={currency(reminder.amount)} />
            <DetailItem label="Person" value={reminder.personName || "N/A"} />
            <DetailItem label="Vehicle" value={reminder.vehicleName || "N/A"} />
            <DetailItem label="Created" value={format(reminder.createdAt, "dd MMM yyyy")} />
            <DetailItem label="Updated" value={format(reminder.updatedAt, "dd MMM yyyy")} />
          </div>

          <div>
            <h3 className="font-semibold">Notes</h3>
            <p className="mt-2 rounded-2xl border bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
              {reminder.notes || "No notes added yet."}
            </p>
          </div>

          <ReminderDetailActions reminderId={reminder.id} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Renewal history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reminder.renewalHistoryEntries.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No renewals yet.</p>
            ) : (
              reminder.renewalHistoryEntries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border p-4">
                  <p className="font-medium">
                    {format(entry.oldDate, "dd MMM yyyy")} -&gt; {format(entry.newDate, "dd MMM yyyy")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Renewed on {format(entry.renewedOn, "dd MMM yyyy")}
                  </p>
                  {entry.notes ? <p className="mt-2 text-sm">{entry.notes}</p> : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-[var(--secondary)] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

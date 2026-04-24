import Link from "next/link";
import { format } from "date-fns";

import { markReminderActiveAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { getHistoryItems } from "@/lib/queries";
import { requireUser } from "@/lib/auth";

export default async function HistoryPage() {
  const user = await requireUser();
  const reminders = await getHistoryItems(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">History & archive</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Review completed, renewed, archived, and expired reminders.</p>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{reminder.title}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {reminder.category.name} • {format(reminder.mainDate, "dd MMM yyyy")}
                  </p>
                </div>
                <StatusBadge status={reminder.status} mainDate={reminder.mainDate} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/reminders/${reminder.id}`}>View</Link>
              </Button>
              <form action={markReminderActiveAction.bind(null, reminder.id)}>
                <Button variant="secondary">Restore to active</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

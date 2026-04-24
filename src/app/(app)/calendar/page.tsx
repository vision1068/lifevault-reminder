import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCalendarItems } from "@/lib/queries";
import { requireUser } from "@/lib/auth";

export default async function CalendarPage() {
  const user = await requireUser();
  const today = new Date();
  const items = await getCalendarItems(user.id, today);
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = format(item.mainDate, "yyyy-MM-dd");
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar view</h1>
        <p className="text-sm text-[var(--muted-foreground)]">A simple monthly snapshot of reminders on their main date.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(grouped).map(([date, reminders]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle>{format(new Date(date), "dd MMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="rounded-2xl border p-4">
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{reminder.category.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

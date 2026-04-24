import Link from "next/link";
import { format } from "date-fns";

import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getReminderMetrics } from "@/lib/date-utils";

type ReminderListProps = {
  reminders: Array<{
    id: string;
    title: string;
    mainDate: Date;
    personName: string | null;
    vehicleName: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status: "ACTIVE" | "COMPLETED" | "RENEWED" | "EXPIRED" | "ARCHIVED";
    category: {
      name: string;
      color: string;
    };
  }>;
};

export function ReminderList({ reminders }: ReminderListProps) {
  return (
    <>
      <div className="space-y-4 lg:hidden">
        {reminders.map((reminder) => {
          const metrics = getReminderMetrics(reminder.mainDate, reminder.status);
          return (
            <Link key={reminder.id} href={`/reminders/${reminder.id}`}>
              <Card className="transition-transform duration-200 hover:-translate-y-0.5">
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{reminder.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{reminder.category.name}</p>
                    </div>
                    <Badge style={{ backgroundColor: reminder.category.color, color: "white" }}>Category</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={reminder.status} mainDate={reminder.mainDate} />
                    <PriorityBadge priority={reminder.priority} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{format(reminder.mainDate, "dd MMM yyyy")}</span>
                    <span className="text-[var(--muted-foreground)]">{metrics.daysRemaining} days left</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border bg-[var(--card)] lg:block">
        <table className="w-full text-sm">
          <thead className="bg-[var(--secondary)] text-left text-[var(--muted-foreground)]">
            <tr>
              <th className="px-5 py-4 font-medium">Reminder</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder) => (
              <tr key={reminder.id} className="border-t">
                <td className="px-5 py-4">
                  <Link href={`/reminders/${reminder.id}`} className="block">
                    <p className="font-semibold">{reminder.title}</p>
                    <p className="text-[var(--muted-foreground)]">
                      {reminder.personName || reminder.vehicleName || "No extra label"}
                    </p>
                  </Link>
                </td>
                <td className="px-5 py-4">{reminder.category.name}</td>
                <td className="px-5 py-4">{format(reminder.mainDate, "dd MMM yyyy")}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={reminder.status} mainDate={reminder.mainDate} />
                </td>
                <td className="px-5 py-4">
                  <PriorityBadge priority={reminder.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

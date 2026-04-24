import Link from "next/link";
import { format } from "date-fns";

import { CategorySummaryChart } from "@/components/category-summary-chart";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { EmptyState } from "@/components/empty-state";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReminderMetrics } from "@/lib/date-utils";
import { getDashboardData } from "@/lib/queries";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard href="/reminders?quick=dueToday" label="Due today" value={data.stats.dueToday} hint="Immediate items needing attention" accent="bg-amber-500/5" />
        <DashboardStatCard href="/reminders?quick=upcoming7" label="Next 7 days" value={data.stats.upcoming7} hint="Short-term upcoming reminders" accent="bg-sky-500/5" />
        <DashboardStatCard href="/reminders?quick=overdue" label="Overdue" value={data.stats.overdue} hint="Catch up on items that slipped" accent="bg-rose-500/5" />
        <DashboardStatCard href="/reminders?quick=highPriority" label="High priority" value={data.stats.highPriority} hint="Critical and high-priority items" accent="bg-emerald-500/5" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming attention list</CardTitle>
          </CardHeader>
          <CardContent>
            {data.reminders.length === 0 ? (
              <EmptyState
                title="No reminders yet"
                description="Create your first reminder and the dashboard will start surfacing due dates, overdue items, and recent renewals."
                actionHref="/reminders/new"
                actionLabel="Add your first reminder"
              />
            ) : (
              <div className="space-y-4">
                {data.reminders.slice(0, 6).map((reminder) => {
                  const metrics = getReminderMetrics(reminder.mainDate, reminder.status);
                  return (
                    <Link key={reminder.id} href={`/reminders/${reminder.id}`} className="flex items-center justify-between gap-3 rounded-2xl border p-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{reminder.title}</p>
                          <StatusBadge status={reminder.status} mainDate={reminder.mainDate} />
                          <PriorityBadge priority={reminder.priority} />
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {reminder.category.name} • {format(reminder.mainDate, "dd MMM yyyy")}
                        </p>
                      </div>
                      <Badge>{metrics.daysRemaining} days</Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category summary</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              {data.categorySummary.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Your category breakdown will appear here.</p>
              ) : (
                <CategorySummaryChart data={data.categorySummary} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently renewed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.renewed.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Renewed reminders will appear here once you start renewing items.</p>
              ) : (
                data.renewed.map((reminder) => (
                  <Link key={reminder.id} href={`/reminders/${reminder.id}`} className="block rounded-2xl border p-4">
                    <p className="font-semibold">{reminder.title}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{format(reminder.mainDate, "dd MMM yyyy")}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

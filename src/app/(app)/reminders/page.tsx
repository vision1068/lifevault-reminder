import { EmptyState } from "@/components/empty-state";
import { ReminderFilters } from "@/components/reminder-filters";
import { ReminderList } from "@/components/reminder-list";
import { db } from "@/lib/db";
import { getRemindersForList } from "@/lib/queries";
import { requireUser } from "@/lib/auth";

export default async function RemindersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const [categories, reminders] = await Promise.all([
    db.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    }),
    getRemindersForList({ userId: user.id, searchParams: params })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">All reminders</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Search, filter, and sort every reminder in one place.</p>
      </div>

      <ReminderFilters categories={categories} searchParams={params} />

      {reminders.length === 0 ? (
        <EmptyState
          title="No reminders match those filters"
          description="Try adjusting your filters or create a new reminder."
          actionHref="/reminders/new"
          actionLabel="Create reminder"
        />
      ) : (
        <ReminderList reminders={reminders} />
      )}
    </div>
  );
}

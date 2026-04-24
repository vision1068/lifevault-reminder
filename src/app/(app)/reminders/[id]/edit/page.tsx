import { format } from "date-fns";
import { notFound } from "next/navigation";

import { ReminderForm } from "@/components/reminder-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export default async function EditReminderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const [categories, reminder] = await Promise.all([
    db.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    }),
    db.reminderItem.findFirst({
      where: { id, userId: user.id }
    })
  ]);

  if (!reminder) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Edit reminder</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Update the reminder details, timing, or status.</p>
      </div>
      <ReminderForm
        categories={categories}
        reminder={{
          id: reminder.id,
          title: reminder.title,
          categoryId: reminder.categoryId,
          personName: reminder.personName,
          vehicleName: reminder.vehicleName,
          mainDate: format(reminder.mainDate, "yyyy-MM-dd"),
          dateType: reminder.dateType,
          reminderBeforeDays: Array.isArray(reminder.reminderBeforeDays) ? reminder.reminderBeforeDays.map(Number) : [7],
          repeat: reminder.repeat,
          priority: reminder.priority,
          status: reminder.status,
          notes: reminder.notes,
          amount: reminder.amount
        }}
      />
    </div>
  );
}

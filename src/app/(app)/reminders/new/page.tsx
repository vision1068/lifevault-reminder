import { ReminderForm } from "@/components/reminder-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export default async function NewReminderPage() {
  const user = await requireUser();
  const categories = await db.category.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Add reminder</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Capture the important details now so future you doesn’t have to scramble.</p>
      </div>
      <ReminderForm categories={categories} />
    </div>
  );
}

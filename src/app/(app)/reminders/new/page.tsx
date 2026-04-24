import { ReminderForm } from "@/components/reminder-form";
import { requireUser } from "@/lib/auth";
import { getActiveCategoriesForUser } from "@/lib/queries";

export default async function NewReminderPage() {
  const user = await requireUser();
  const categories = await getActiveCategoriesForUser(user.id);

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

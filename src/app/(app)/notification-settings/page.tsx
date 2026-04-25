import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettingsForm } from "@/components/notification-settings-form";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const futureItems = [
  ["PWA browser notifications", "Coming soon"],
  ["WhatsApp reminders", "Future idea"],
  ["Google Calendar sync", "Future idea"]
];

export default async function NotificationSettingsPage() {
  const user = await requireUser();
  const preference = await db.notificationPreference.findUnique({
    where: { userId: user.id },
    select: { emailEnabled: true, emailReminderTime: true, emailTimeZone: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notification settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Control how LifeVault sends reminder notifications.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Live channels</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSettingsForm
            email={user.email}
            emailEnabled={preference?.emailEnabled ?? false}
            emailReminderTime={preference?.emailReminderTime ?? "12:00"}
            emailTimeZone={preference?.emailTimeZone ?? "Asia/Riyadh"}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Planned options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {futureItems.map(([label, status]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border p-4">
              <span>{label}</span>
              <span className="text-sm text-[var(--muted-foreground)]">{status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

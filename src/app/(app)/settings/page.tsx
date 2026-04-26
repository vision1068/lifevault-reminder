import { NotificationSettingsForm } from "@/components/notification-settings-form";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const futureItems = [
  ["PWA browser notifications", "Coming soon"],
  ["WhatsApp reminders", "Future idea"],
  ["Google Calendar sync", "Future idea"]
];

export default async function SettingsPage() {
  const user = await requireUser();
  const preference = await db.notificationPreference.findUnique({
    where: { userId: user.id },
    select: { emailEnabled: true, emailReminderTime: true, emailTimeZone: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Manage your account details and notification preferences in one place.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultName={user.name || ""} defaultEmail={user.email} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
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

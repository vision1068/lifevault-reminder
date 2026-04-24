import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const futureItems = [
  ["Email reminders", "Coming soon"],
  ["PWA browser notifications", "Coming soon"],
  ["WhatsApp reminders", "Future idea"],
  ["Google Calendar sync", "Future idea"]
];

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notification settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">MVP placeholder for future reminder delivery channels.</p>
      </div>
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

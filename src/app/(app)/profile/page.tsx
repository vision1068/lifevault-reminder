import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile & settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Manage your account details for this MVP workspace.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Account information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultName={user.name || ""} defaultEmail={user.email} />
        </CardContent>
      </Card>
    </div>
  );
}

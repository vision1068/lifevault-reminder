import { redirectIfAuthenticated } from "@/lib/auth";
import { loginAction } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <AuthForm
        title="Welcome back"
        description="Log in to manage family and personal reminders in one calm dashboard."
        action={loginAction}
        submitLabel="Login"
        alternateHref="/signup"
        alternateLabel="Create an account"
      />
    </main>
  );
}

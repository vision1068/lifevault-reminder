import { signupAction } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";
import { redirectIfAuthenticated } from "@/lib/auth";

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <AuthForm
        title="Create your LifeVault"
        description="Start tracking every important date before it turns urgent."
        action={signupAction}
        submitLabel="Sign up"
        alternateHref="/login"
        alternateLabel="Already have an account?"
        includeName
      />
    </main>
  );
}

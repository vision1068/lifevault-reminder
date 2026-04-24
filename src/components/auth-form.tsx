"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  title: string;
  description: string;
  action: (state: { success?: boolean; message?: string }, formData: FormData) => Promise<{ success?: boolean; message?: string; errors?: Record<string, string[]> }>;
  submitLabel: string;
  alternateHref: ComponentProps<typeof Link>["href"];
  alternateLabel: string;
  includeName?: boolean;
};

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
  alternateHref,
  alternateLabel,
  includeName = false
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {includeName ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" />
              <FormMessage message={state.errors?.name?.[0]} />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            <FormMessage message={state.errors?.email?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="At least 8 characters" required />
            <FormMessage message={state.errors?.password?.[0]} />
          </div>

          <SubmitButton className="w-full">{submitLabel}</SubmitButton>
          <Button asChild className="w-full" variant="ghost">
            <Link href={alternateHref}>{alternateLabel}</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

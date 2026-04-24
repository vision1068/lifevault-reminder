"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { updateProfileAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  defaultName,
  defaultEmail
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const [state, formAction] = useActionState(updateProfileAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaultName} />
        <FormMessage message={state.errors?.name?.[0]} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultEmail} />
        <FormMessage message={state.errors?.email?.[0]} />
      </div>
      <SubmitButton>Save profile</SubmitButton>
    </form>
  );
}

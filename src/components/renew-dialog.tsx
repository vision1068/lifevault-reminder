"use client";

import { useActionState, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { renewReminderAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RenewDialog({ reminderId }: { reminderId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(renewReminderAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      window.setTimeout(() => setOpen(false), 0);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <RefreshCw className="size-4" />
          Renew
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew reminder</DialogTitle>
          <DialogDescription>Move the reminder forward and keep the old date in renewal history.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input name="reminderId" type="hidden" value={reminderId} />
          <div className="space-y-2">
            <Label htmlFor="newDate">New main date</Label>
            <Input id="newDate" name="newDate" type="date" />
            <FormMessage message={state.errors?.newDate?.[0]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Renewal notes</Label>
            <Textarea id="notes" name="notes" placeholder="Optional notes about this renewal" />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitButton>Save renewal</SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

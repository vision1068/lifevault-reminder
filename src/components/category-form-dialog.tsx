"use client";

import { useActionState, useEffect, useState } from "react";
import { Edit3, Plus } from "lucide-react";
import { toast } from "sonner";

import { saveCategoryAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { iconMap } from "@/lib/icons";

type CategoryFormDialogProps = {
  category?: {
    id: string;
    name: string;
    iconName: string;
    color: string;
    description: string | null;
    isActive: boolean;
  };
};

export function CategoryFormDialog({ category }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(saveCategoryAction, {});

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
        <Button variant={category ? "outline" : "default"}>
          {category ? <Edit3 className="size-4" /> : <Plus className="size-4" />}
          {category ? "Edit" : "Add category"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "Create category"}</DialogTitle>
          <DialogDescription>Keep categories flexible so the app works beyond documents or vehicles.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input name="id" type="hidden" defaultValue={category?.id} />
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input id="category-name" name="name" defaultValue={category?.name} />
            <FormMessage message={state.errors?.name?.[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconName">Icon name</Label>
            <select
              id="iconName"
              name="iconName"
              defaultValue={category?.iconName ?? "FolderKanban"}
              className="h-11 w-full rounded-2xl border bg-[var(--input)] px-4 text-sm"
            >
              {Object.keys(iconMap).map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-color">Color</Label>
            <Input id="category-color" name="color" type="color" defaultValue={category?.color ?? "#0f766e"} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea id="category-description" name="description" defaultValue={category?.description ?? ""} />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border p-4">
            <Checkbox name="isActive" defaultChecked={category?.isActive ?? true} />
            <span className="text-sm">Category is active</span>
          </label>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitButton>{category ? "Save changes" : "Create category"}</SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

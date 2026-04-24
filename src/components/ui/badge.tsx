import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
      destructive: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
      info: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

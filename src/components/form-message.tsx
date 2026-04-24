import { cn } from "@/lib/utils";

export function FormMessage({
  message,
  variant = "error"
}: {
  message?: string;
  variant?: "error" | "success";
}) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-sm",
        variant === "error"
          ? "text-rose-600 dark:text-rose-300"
          : "text-emerald-600 dark:text-emerald-300"
      )}
    >
      {message}
    </p>
  );
}

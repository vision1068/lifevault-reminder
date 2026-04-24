import Link from "next/link";
import { Category, Priority, ReminderStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";

export function ReminderFilters({
  categories,
  searchParams
}: {
  categories: Pick<Category, "id" | "name">[];
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const value = (key: string) => {
    const entry = searchParams?.[key];
    return Array.isArray(entry) ? entry[0] : entry ?? "";
  };

  return (
    <form className="grid gap-3 rounded-[28px] border bg-[var(--card)] p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
      <Input name="search" defaultValue={value("search")} placeholder="Search title, person, vehicle" />
      <select name="category" defaultValue={value("category")} className="h-11 rounded-2xl border bg-[var(--input)] px-4 text-sm">
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select name="priority" defaultValue={value("priority")} className="h-11 rounded-2xl border bg-[var(--input)] px-4 text-sm">
        <option value="">All priorities</option>
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value as Priority}>
            {option.label}
          </option>
        ))}
      </select>
      <select name="status" defaultValue={value("status")} className="h-11 rounded-2xl border bg-[var(--input)] px-4 text-sm">
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value as ReminderStatus}>
            {option.label}
          </option>
        ))}
      </select>
      <Input name="person" defaultValue={value("person")} placeholder="Person name" />
      <Input name="vehicle" defaultValue={value("vehicle")} placeholder="Vehicle name" />
      <Input name="dateFrom" type="date" defaultValue={value("dateFrom")} />
      <Input name="dateTo" type="date" defaultValue={value("dateTo")} />
      <select name="quick" defaultValue={value("quick")} className="h-11 rounded-2xl border bg-[var(--input)] px-4 text-sm">
        <option value="">Quick filter</option>
        <option value="dueToday">Due today</option>
        <option value="upcoming7">Upcoming 7 days</option>
        <option value="upcoming15">Upcoming 15 days</option>
        <option value="upcoming30">Upcoming 30 days</option>
        <option value="overdue">Overdue</option>
        <option value="highPriority">High priority</option>
      </select>
      <select name="sort" defaultValue={value("sort") || "mainDateAsc"} className="h-11 rounded-2xl border bg-[var(--input)] px-4 text-sm">
        <option value="mainDateAsc">Main date ascending</option>
        <option value="mainDateDesc">Main date descending</option>
        <option value="priority">Priority</option>
        <option value="category">Category</option>
        <option value="createdAt">Created date</option>
      </select>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Apply filters
        </Button>
        <Button type="button" variant="outline" className="flex-1" asChild>
          <Link href="/reminders">Reset</Link>
        </Button>
      </div>
    </form>
  );
}

import "server-only";

import { Prisma, ReminderStatus } from "@prisma/client";
import { addDays, endOfDay, startOfDay } from "date-fns";

import { db } from "@/lib/db";
import { getReminderMetrics } from "@/lib/date-utils";

type ReminderFilterInput = {
  userId: string;
  searchParams?: Record<string, string | string[] | undefined>;
};

function parseSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getDashboardData(userId: string) {
  const today = new Date();
  const reminders = await db.reminderItem.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      mainDate: true,
      priority: true,
      status: true,
      category: {
        select: {
          name: true
        }
      },
      renewalHistoryEntries: {
        select: {
          id: true
        },
        orderBy: { renewedOn: "desc" },
        take: 3
      }
    },
    orderBy: { mainDate: "asc" }
  });

  const active = reminders.filter((item) => item.status === ReminderStatus.ACTIVE);
  const dueToday = active.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isDueToday);
  const upcoming7 = active.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isUpcoming7Days);
  const upcoming15 = active.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isUpcoming15Days);
  const upcoming30 = active.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isUpcoming30Days);
  const overdue = active.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isOverdue);
  const highPriority = active.filter(
    (item) => item.priority === "HIGH" || item.priority === "CRITICAL"
  );
  const renewed = reminders
    .filter((item) => item.status === ReminderStatus.RENEWED || item.renewalHistoryEntries.length > 0)
    .slice(0, 5);

  const categorySummary = reminders.reduce<Record<string, number>>((acc, reminder) => {
    acc[reminder.category.name] = (acc[reminder.category.name] ?? 0) + 1;
    return acc;
  }, {});

  return {
    reminders,
    stats: {
      dueToday: dueToday.length,
      upcoming7: upcoming7.length,
      upcoming15: upcoming15.length,
      upcoming30: upcoming30.length,
      overdue: overdue.length,
      highPriority: highPriority.length,
      totalActive: active.length
    },
    categorySummary: Object.entries(categorySummary).map(([name, value]) => ({
      name,
      value
    })),
    dueToday,
    overdue,
    renewed
  };
}

export async function getRemindersForList({ userId, searchParams }: ReminderFilterInput) {
  const today = new Date();
  const search = parseSearchParam(searchParams?.search);
  const categoryId = parseSearchParam(searchParams?.category);
  const priority = parseSearchParam(searchParams?.priority);
  const status = parseSearchParam(searchParams?.status);
  const person = parseSearchParam(searchParams?.person);
  const vehicle = parseSearchParam(searchParams?.vehicle);
  const sort = parseSearchParam(searchParams?.sort) ?? "mainDateAsc";
  const quick = parseSearchParam(searchParams?.quick);
  const dateFrom = parseSearchParam(searchParams?.dateFrom);
  const dateTo = parseSearchParam(searchParams?.dateTo);

  const where: Prisma.ReminderItemWhereInput = {
    userId,
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { personName: { contains: search } },
            { vehicleName: { contains: search } }
          ]
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(priority ? { priority: priority as Prisma.EnumPriorityFilter<"ReminderItem"> } : {}),
    ...(status ? { status: status as Prisma.EnumReminderStatusFilter<"ReminderItem"> } : {}),
    ...(person ? { personName: { contains: person } } : {}),
    ...(vehicle ? { vehicleName: { contains: vehicle } } : {}),
    ...(dateFrom || dateTo
      ? {
          mainDate: {
            ...(dateFrom ? { gte: startOfDay(new Date(dateFrom)) } : {}),
            ...(dateTo ? { lte: endOfDay(new Date(dateTo)) } : {})
          }
        }
      : {})
  };

  const orderBy: Prisma.ReminderItemOrderByWithRelationInput =
    sort === "mainDateDesc"
      ? { mainDate: "desc" }
      : sort === "priority"
        ? { priority: "desc" }
        : sort === "category"
          ? { category: { name: "asc" } }
          : sort === "createdAt"
            ? { createdAt: "desc" }
            : { mainDate: "asc" };

  const reminders = await db.reminderItem.findMany({
    where,
    select: {
      id: true,
      title: true,
      mainDate: true,
      personName: true,
      vehicleName: true,
      priority: true,
      status: true,
      category: {
        select: {
          name: true,
          color: true
        }
      }
    },
    orderBy
  });

  const filtered = reminders.filter((item) => {
    const metrics = getReminderMetrics(item.mainDate, item.status, today);

    switch (quick) {
      case "dueToday":
        return metrics.isDueToday;
      case "upcoming7":
        return metrics.isUpcoming7Days;
      case "upcoming15":
        return metrics.isUpcoming15Days;
      case "upcoming30":
        return metrics.isUpcoming30Days;
      case "overdue":
        return metrics.isOverdue;
      case "highPriority":
        return item.priority === "HIGH" || item.priority === "CRITICAL";
      default:
        return true;
    }
  });

  return filtered;
}

export async function getHistoryItems(userId: string) {
  return db.reminderItem.findMany({
    where: {
      userId,
      status: {
        in: ["COMPLETED", "RENEWED", "ARCHIVED", "EXPIRED"]
      }
    },
    include: {
      category: {
        select: {
          name: true
        }
      },
      renewalHistoryEntries: {
        select: {
          id: true,
          renewedOn: true
        },
        orderBy: { renewedOn: "desc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getCalendarItems(userId: string, month: Date) {
  return db.reminderItem.findMany({
    where: {
      userId,
      mainDate: {
        gte: startOfDay(new Date(month.getFullYear(), month.getMonth(), 1)),
        lte: endOfDay(addDays(new Date(month.getFullYear(), month.getMonth() + 1, 1), -1))
      }
    },
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: { mainDate: "asc" }
  });
}

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

  const actionable = reminders.filter(
    (item) => item.status === ReminderStatus.ACTIVE || item.status === ReminderStatus.RENEWED
  );
  const dueToday = actionable.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isDueToday);
  const upcoming7 = actionable.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isUpcoming7Days);
  const upcoming15 = actionable.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isUpcoming15Days);
  const upcoming30 = actionable.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isUpcoming30Days);
  const overdue = actionable.filter((item) => getReminderMetrics(item.mainDate, item.status, today).isOverdue);
  const highPriority = actionable.filter(
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
      totalActive: actionable.length
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
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
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

  let quickWhere: Prisma.ReminderItemWhereInput = {};

  switch (quick) {
    case "dueToday":
      quickWhere = {
        status: ReminderStatus.ACTIVE,
        mainDate: {
          gte: todayStart,
          lte: todayEnd
        }
      };
      break;
    case "upcoming7":
      quickWhere = {
        status: ReminderStatus.ACTIVE,
        mainDate: {
          gt: todayEnd,
          lte: endOfDay(addDays(todayStart, 7))
        }
      };
      break;
    case "upcoming15":
      quickWhere = {
        status: ReminderStatus.ACTIVE,
        mainDate: {
          gt: todayEnd,
          lte: endOfDay(addDays(todayStart, 15))
        }
      };
      break;
    case "upcoming30":
      quickWhere = {
        status: ReminderStatus.ACTIVE,
        mainDate: {
          gt: todayEnd,
          lte: endOfDay(addDays(todayStart, 30))
        }
      };
      break;
    case "overdue":
      quickWhere = {
        status: ReminderStatus.ACTIVE,
        mainDate: {
          lt: todayStart
        }
      };
      break;
    case "highPriority":
      quickWhere = {
        priority: {
          in: ["HIGH", "CRITICAL"]
        }
      };
      break;
    default:
      quickWhere = {};
  }

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
      : {}),
    ...quickWhere
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

  return reminders;
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

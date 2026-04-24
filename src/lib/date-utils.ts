import { ReminderStatus } from "@prisma/client";
import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay
} from "date-fns";

export type ReminderMetrics = {
  daysRemaining: number;
  isDueToday: boolean;
  isOverdue: boolean;
  isUpcoming7Days: boolean;
  isUpcoming15Days: boolean;
  isUpcoming30Days: boolean;
  isDueSoon: boolean;
  statusLabel: string;
};

export function toDate(date: Date | string) {
  return typeof date === "string" ? parseISO(date) : date;
}

export function getReminderMetrics(
  mainDate: Date | string,
  status: ReminderStatus = ReminderStatus.ACTIVE,
  today = new Date()
): ReminderMetrics {
  const date = toDate(mainDate);
  const todayStart = startOfDay(today);
  const dateStart = startOfDay(date);
  const daysRemaining = differenceInCalendarDays(dateStart, todayStart);
  const isDueToday = isSameDay(dateStart, todayStart);
  const isOverdue = isBefore(endOfDay(dateStart), todayStart) && status === ReminderStatus.ACTIVE;
  const isUpcoming7Days = !isOverdue && !isDueToday && isBefore(dateStart, addDays(todayStart, 8));
  const isUpcoming15Days = !isOverdue && !isDueToday && isBefore(dateStart, addDays(todayStart, 16));
  const isUpcoming30Days = !isOverdue && !isDueToday && isBefore(dateStart, addDays(todayStart, 31));
  const isDueSoon = !isOverdue && !isDueToday && isBefore(dateStart, addDays(todayStart, 8));

  let statusLabel = "Active";

  if (status === ReminderStatus.COMPLETED) {
    statusLabel = "Completed";
  } else if (status === ReminderStatus.RENEWED) {
    statusLabel = "Renewed";
  } else if (status === ReminderStatus.ARCHIVED) {
    statusLabel = "Archived";
  } else if (status === ReminderStatus.EXPIRED || isOverdue) {
    statusLabel = "Overdue";
  } else if (isDueToday) {
    statusLabel = "Due Today";
  } else if (isDueSoon) {
    statusLabel = "Due Soon";
  }

  return {
    daysRemaining,
    isDueToday,
    isOverdue,
    isUpcoming7Days,
    isUpcoming15Days,
    isUpcoming30Days,
    isDueSoon,
    statusLabel
  };
}

export function shouldShowReminder(
  mainDate: Date | string,
  reminderBeforeDays: number[],
  today = new Date()
) {
  const date = toDate(mainDate);
  const start = startOfDay(today);

  return reminderBeforeDays.some((days) => {
    const reminderDate = addDays(startOfDay(date), -days);
    return isSameDay(reminderDate, start) || isAfter(reminderDate, start);
  });
}

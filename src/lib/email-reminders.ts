import "server-only";

import { ReminderStatus } from "@prisma/client";
import { differenceInCalendarDays, format, startOfDay } from "date-fns";

import { db } from "@/lib/db";
import { sendGeneralReminderEmail } from "@/lib/email";

type ProcessorResult = {
  checked: number;
  sent: number;
  skipped: number;
  errors: number;
};

function normalizeReminderDays(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw.map(Number).filter((value) => Number.isFinite(value) && value >= 0);
}

export async function processDueEmailReminders(referenceDate = new Date()): Promise<ProcessorResult> {
  const today = startOfDay(referenceDate);
  const eligibleUsers = await db.user.findMany({
    where: {
      notificationPreference: {
        emailEnabled: true
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      reminders: {
        where: {
          status: {
            in: [ReminderStatus.ACTIVE, ReminderStatus.RENEWED]
          }
        },
        select: {
          id: true,
          title: true,
          mainDate: true,
          notes: true,
          reminderBeforeDays: true,
          category: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  let checked = 0;
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of eligibleUsers) {
    const dueReminders = user.reminders.filter((reminder) => {
      const daysRemaining = differenceInCalendarDays(startOfDay(reminder.mainDate), today);
      return normalizeReminderDays(reminder.reminderBeforeDays).includes(daysRemaining);
    });

    for (const reminder of dueReminders) {
      checked += 1;
      const notificationKey = `due:${format(today, "yyyy-MM-dd")}`;
      const existing = await db.notificationLog.findFirst({
        where: {
          userId: user.id,
          reminderId: reminder.id,
          channel: "email",
          status: "SENT",
          message: notificationKey
        },
        select: { id: true }
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      const daysRemaining = differenceInCalendarDays(startOfDay(reminder.mainDate), today);

      try {
        await sendGeneralReminderEmail({
          to: user.email,
          recipientName: user.name,
          reminderTitle: reminder.title,
          categoryName: reminder.category.name,
          mainDate: reminder.mainDate,
          notes: reminder.notes,
          daysRemaining
        });

        await db.notificationLog.create({
          data: {
            userId: user.id,
            reminderId: reminder.id,
            channel: "email",
            status: "SENT",
            message: notificationKey
          }
        });
        sent += 1;
      } catch (error) {
        console.error("Email reminder failed", { userId: user.id, reminderId: reminder.id, error });
        await db.notificationLog.create({
          data: {
            userId: user.id,
            reminderId: reminder.id,
            channel: "email",
            status: "FAILED",
            message: notificationKey
          }
        });
        errors += 1;
      }
    }
  }

  return { checked, sent, skipped, errors };
}

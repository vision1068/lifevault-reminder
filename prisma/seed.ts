import bcrypt from "bcryptjs";
import { DateType, Priority, ReminderStatus, RepeatType } from "@prisma/client";

import { DEFAULT_CATEGORIES } from "../src/lib/constants";
import { db } from "../src/lib/db";

async function main() {
  const email = "demo@lifevault.app";
  const passwordHash = await bcrypt.hash("demo12345", 10);

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo User",
      passwordHash,
      notificationPreference: {
        create: {}
      }
    }
  });

  for (const category of DEFAULT_CATEGORIES) {
    await db.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: category.name
        }
      },
      update: category,
      create: {
        userId: user.id,
        ...category
      }
    });
  }

  const categories = await db.category.findMany({ where: { userId: user.id } });
  const categoryByName = Object.fromEntries(categories.map((category) => [category.name, category.id]));

  const reminders = [
    ["Passport expiry", "Personal Documents", "2026-12-12", DateType.EXPIRY_DATE, Priority.HIGH, "Self passport", null],
    ["Qatar ID expiry", "Personal Documents", "2026-08-20", DateType.EXPIRY_DATE, Priority.CRITICAL, "QID renewal", null],
    ["Car insurance expiry", "Vehicle", "2026-06-30", DateType.RENEWAL_DATE, Priority.CRITICAL, null, "Toyota Prado"],
    ["Oil change", "Vehicle", "2026-05-15", DateType.SERVICE_DATE, Priority.MEDIUM, null, "Toyota Prado"],
    ["Birthday reminder", "Birthdays", "2026-07-08", DateType.EVENT_DATE, Priority.MEDIUM, "Sara", null],
    ["Credit card due date", "Finance & Bills", "2026-05-02", DateType.DUE_DATE, Priority.HIGH, null, null],
    ["Baby vaccination", "Health", "2026-06-11", DateType.APPOINTMENT_DATE, Priority.HIGH, "Baby Adam", null],
    ["Home internet bill", "Finance & Bills", "2026-05-05", DateType.DUE_DATE, Priority.MEDIUM, null, null],
    ["AC service", "Home & Warranty", "2026-05-22", DateType.SERVICE_DATE, Priority.MEDIUM, null, null],
    ["Subscription renewal", "Subscription", "2026-05-10", DateType.RENEWAL_DATE, Priority.LOW, null, null]
  ] as const;

  for (const [title, categoryName, date, dateType, priority, personName, vehicleName] of reminders) {
    await db.reminderItem.upsert({
      where: {
        id_userId: {
          id: `${title}-${user.id}`.replaceAll(" ", "-").toLowerCase(),
          userId: user.id
        }
      },
      update: {},
      create: {
        id: `${title}-${user.id}`.replaceAll(" ", "-").toLowerCase(),
        userId: user.id,
        categoryId: categoryByName[categoryName],
        title,
        personName,
        vehicleName,
        mainDate: new Date(date),
        dateType,
        reminderBeforeDays: [0, 7, 15, 30],
        repeat: RepeatType.YEARLY,
        priority,
        status: ReminderStatus.ACTIVE,
        notes: `${title} sample reminder`,
        amount: title.includes("bill") ? 90 : title.includes("card") ? 650 : null
      }
    });
  }

  console.log("Seed complete. Demo login: demo@lifevault.app / demo12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

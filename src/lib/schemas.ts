import { DateType, Priority, ReminderStatus, RepeatType } from "@prisma/client";
import { z } from "zod";

export const authSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().min(2, "Name must be at least 2 characters.").max(80).optional().or(z.literal(""))
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name is required."),
  iconName: z.string().min(1, "Choose an icon."),
  color: z.string().min(4, "Choose a color."),
  description: z.string().max(240, "Description is too long.").optional().or(z.literal("")),
  isActive: z.boolean().default(true)
});

export const reminderSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title is required."),
  categoryId: z.string().min(1, "Choose a category."),
  personName: z.string().max(80).optional().or(z.literal("")),
  vehicleName: z.string().max(80).optional().or(z.literal("")),
  mainDate: z.string().min(1, "Main date is required."),
  dateType: z.nativeEnum(DateType),
  reminderBeforeDays: z.array(z.number()).min(1, "Choose at least one reminder timing."),
  customReminderDays: z.number().int().min(1).max(365).optional(),
  repeat: z.nativeEnum(RepeatType),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(ReminderStatus),
  notes: z.string().max(2000).optional().or(z.literal("")),
  amount: z
    .union([z.number().min(0), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && !Number.isNaN(value) ? value : undefined))
});

export const renewSchema = z.object({
  reminderId: z.string().min(1),
  newDate: z.string().min(1, "New date is required."),
  notes: z.string().max(500).optional().or(z.literal(""))
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required.").max(80),
  email: z.email("Enter a valid email address.")
});

export const notificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().default(false),
  emailReminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Choose a valid daily reminder time."),
  emailTimeZone: z.string().min(1, "Choose a timezone.")
});

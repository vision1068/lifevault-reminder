"use server";

import { Priority, ReminderStatus, RepeatType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { clearSession, createSession, requireUser } from "@/lib/auth";
import { ensureDefaultCategories } from "@/lib/category-service";
import { db } from "@/lib/db";
import { processDueEmailRemindersForUser } from "@/lib/email-reminders";
import {
  authSchema,
  categorySchema,
  notificationPreferencesSchema,
  profileSchema,
  reminderSchema,
  renewSchema
} from "@/lib/schemas";

type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

type MutationResult = {
  success: boolean;
  message?: string;
};

function revalidateUserData(userId: string) {
  revalidateTag(`reminders:${userId}`, "max");
  revalidateTag(`dashboard:${userId}`, "max");
  revalidateTag(`history:${userId}`, "max");
  revalidateTag(`calendar:${userId}`, "max");
  revalidateTag(`categories:${userId}`, "max");
}

function validationError(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): ActionState {
  return {
    success: false,
    message: "Please review the highlighted fields.",
    errors: error.flatten().fieldErrors
  };
}

export async function signupAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name")
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  let userEmail = "";

  try {
    const existing = await db.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() }
    });

    if (existing) {
      return {
        success: false,
        message: "An account with that email already exists."
      };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await db.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name || parsed.data.email.split("@")[0],
        passwordHash,
        notificationPreference: {
          create: {}
        }
      }
    });

    await ensureDefaultCategories(user.id);
    await createSession({ userId: user.id, email: user.email });
    userEmail = user.email;
  } catch (error) {
    console.error("Signup failed", error);
    return {
      success: false,
      message: "We couldn't create your account right now. Please try again in a moment."
    };
  }

  if (!userEmail) {
    return {
      success: false,
      message: "We couldn't create your account right now. Please try again in a moment."
    };
  }

  redirect("/dashboard");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.omit({ name: true }).safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  let loggedIn = false;

  try {
    const user = await db.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() }
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    const matches = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!matches) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    await createSession({ userId: user.id, email: user.email });
    loggedIn = true;
  } catch (error) {
    console.error("Login failed", error);
    return {
      success: false,
      message: "We couldn't log you in right now. Please try again in a moment."
    };
  }

  if (!loggedIn) {
    return {
      success: false,
      message: "We couldn't log you in right now. Please try again in a moment."
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function saveCategoryAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = categorySchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    iconName: formData.get("iconName"),
    color: formData.get("color"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "on"
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (parsed.data.id) {
    await db.category.update({
      where: {
        id_userId: {
          id: parsed.data.id,
          userId: user.id
        }
      },
      data: {
        name: parsed.data.name,
        iconName: parsed.data.iconName,
        color: parsed.data.color,
        description: parsed.data.description || null,
        isActive: parsed.data.isActive
      }
    });
  } else {
    await db.category.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        iconName: parsed.data.iconName,
        color: parsed.data.color,
        description: parsed.data.description || null,
        isActive: parsed.data.isActive
      }
    });
  }

  revalidateUserData(user.id);
  revalidatePath("/categories");

  return {
    success: true,
    message: "Category saved successfully."
  };
}

export async function toggleCategoryAction(categoryId: string, isActive: boolean) {
  const user = await requireUser();
  await db.category.update({
    where: {
      id_userId: {
        id: categoryId,
        userId: user.id
      }
    },
    data: {
      isActive
    }
  });
  revalidateUserData(user.id);
  revalidatePath("/categories");
}

function parseReminderDays(formData: FormData) {
  const selected = formData
    .getAll("reminderBeforeDays")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
  const custom = Number(formData.get("customReminderDays"));

  if (Number.isFinite(custom) && custom > 0 && !selected.includes(custom)) {
    selected.push(custom);
  }

  return [...new Set(selected)].sort((a, b) => a - b);
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value == null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function saveReminderAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const reminderBeforeDays = parseReminderDays(formData);

  const parsed = reminderSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
    personName: formData.get("personName"),
    vehicleName: formData.get("vehicleName"),
    mainDate: formData.get("mainDate"),
    dateType: formData.get("dateType"),
    reminderBeforeDays,
    customReminderDays: parseOptionalNumber(formData.get("customReminderDays")),
    repeat: formData.get("repeat"),
    priority: formData.get("priority") || Priority.MEDIUM,
    status: formData.get("status") || ReminderStatus.ACTIVE,
    notes: formData.get("notes"),
    amount: parseOptionalNumber(formData.get("amount"))
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const reminderData = {
    categoryId: parsed.data.categoryId,
    title: parsed.data.title,
    personName: parsed.data.personName || null,
    vehicleName: parsed.data.vehicleName || null,
    mainDate: new Date(parsed.data.mainDate),
    dateType: parsed.data.dateType,
    reminderBeforeDays: parsed.data.reminderBeforeDays,
    repeat: parsed.data.repeat,
    priority: parsed.data.priority,
    status: parsed.data.status,
    notes: parsed.data.notes || null,
    amount: parsed.data.amount ?? null
  };

  try {
    if (parsed.data.id) {
      await db.reminderItem.update({
        where: {
          id_userId: {
            id: parsed.data.id,
            userId: user.id
          }
        },
        data: reminderData
      });
    } else {
      await db.reminderItem.create({
        data: {
          userId: user.id,
          ...reminderData
        }
      });
    }
  } catch (error) {
    console.error("Save reminder failed", error);
    return {
      success: false,
      message: "We couldn't save that reminder right now. Please try again."
    };
  }

  revalidateUserData(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/reminders");
  revalidatePath("/calendar");
  revalidatePath("/history");

  return {
    success: true,
    message: parsed.data.id ? "Reminder updated." : "Reminder created."
  };
}

export async function markReminderStatusAction(
  reminderId: string,
  status: ReminderStatus,
  redirectTo = "/reminders"
) {
  const result = await setReminderStatusAction(reminderId, status);

  if (!result.success) {
    redirect("/reminders?error=missing");
  }

  redirect(redirectTo);
}

export async function deleteReminderAction(reminderId: string, redirectTo = "/reminders") {
  const result = await deleteReminderByIdAction(reminderId);

  if (!result.success) {
    redirect("/reminders?error=missing");
  }

  redirect(redirectTo);
}

export async function renewReminderAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = renewSchema.safeParse({
    reminderId: formData.get("reminderId"),
    newDate: formData.get("newDate"),
    notes: formData.get("notes")
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const reminder = await db.reminderItem.findUnique({
    where: {
      id_userId: {
        id: parsed.data.reminderId,
        userId: user.id
      }
    }
  });

  if (!reminder) {
    return {
      success: false,
      message: "Reminder not found."
    };
  }

  try {
    await db.$transaction([
      db.renewalHistory.create({
        data: {
          reminderItemId: reminder.id,
          oldDate: reminder.mainDate,
          newDate: new Date(parsed.data.newDate),
          notes: parsed.data.notes || null
        }
      }),
      db.reminderItem.update({
        where: { id: reminder.id },
        data: {
          mainDate: new Date(parsed.data.newDate),
          status: ReminderStatus.RENEWED
        }
      })
    ]);
  } catch (error) {
    console.error("Renew reminder failed", { reminderId: reminder.id, userId: user.id, error });
    return {
      success: false,
      message: "We couldn't renew that reminder right now. Please refresh and try again."
    };
  }

  revalidateUserData(user.id);
  revalidatePath(`/reminders/${reminder.id}`);

  return {
    success: true,
    message: "Reminder renewed successfully."
  };
}

export async function updateProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email")
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase()
    }
  });

  revalidatePath("/profile");

  return {
    success: true,
    message: "Profile updated."
  };
}

export async function updateNotificationSettingsAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = notificationPreferencesSchema.safeParse({
    emailEnabled: formData.get("emailEnabled") === "on",
    emailReminderTime: formData.get("emailReminderTime"),
    emailTimeZone: formData.get("emailTimeZone")
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  await db.notificationPreference.upsert({
    where: { userId: user.id },
    update: {
      emailEnabled: parsed.data.emailEnabled,
      emailReminderTime: parsed.data.emailReminderTime,
      emailTimeZone: parsed.data.emailTimeZone
    },
    create: {
      userId: user.id,
      emailEnabled: parsed.data.emailEnabled,
      emailReminderTime: parsed.data.emailReminderTime,
      emailTimeZone: parsed.data.emailTimeZone
    }
  });

  revalidatePath("/notification-settings");

  return {
    success: true,
    message: parsed.data.emailEnabled
      ? `Email reminders enabled for ${parsed.data.emailReminderTime} (${parsed.data.emailTimeZone}).`
      : "Email reminders disabled."
  };
}

export async function sendMyDueReminderEmailsAction(previousState: ActionState): Promise<ActionState> {
  void previousState;
  const user = await requireUser();

  try {
    const result = await processDueEmailRemindersForUser(user.id);

    if (result.sent > 0) {
      return {
        success: true,
        message: `Sent ${result.sent} reminder email${result.sent === 1 ? "" : "s"} to ${user.email}.`
      };
    }

    if (result.skipped > 0) {
      return {
        success: true,
        message: "Today's due reminder email has already been sent."
      };
    }

    return {
      success: true,
      message: "No email reminders are due for your account right now."
    };
  } catch (error) {
    console.error("Send due reminder emails failed", { userId: user.id, error });
    return {
      success: false,
      message: "We couldn't send reminder emails right now. Please try again."
    };
  }
}

export async function markReminderActiveAction(reminderId: string, redirectTo = "/history") {
  const user = await requireUser();

  try {
    await db.reminderItem.update({
      where: {
        id_userId: {
          id: reminderId,
          userId: user.id
        }
      },
      data: {
        status: ReminderStatus.ACTIVE,
        completedAt: null,
        archivedAt: null,
        repeat: RepeatType.NONE
      }
    });
  } catch (error) {
    console.error("Restore reminder failed", { reminderId, userId: user.id, error });
    redirect("/history?error=missing");
  }

  revalidateUserData(user.id);
  redirect(redirectTo);
}

export async function setReminderStatusAction(reminderId: string, status: ReminderStatus): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await db.reminderItem.update({
      where: {
        id_userId: {
          id: reminderId,
          userId: user.id
        }
      },
      data: {
        status,
        completedAt: status === ReminderStatus.COMPLETED ? new Date() : null,
        archivedAt: status === ReminderStatus.ARCHIVED ? new Date() : null
      }
    });
  } catch (error) {
    console.error("Set reminder status failed", { reminderId, userId: user.id, status, error });
    return {
      success: false,
      message: "We couldn't update that reminder. Please refresh and try again."
    };
  }

  revalidateUserData(user.id);
  return { success: true };
}

export async function deleteReminderByIdAction(reminderId: string): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await db.reminderItem.delete({
      where: {
        id_userId: {
          id: reminderId,
          userId: user.id
        }
      }
    });
  } catch (error) {
    console.error("Delete reminder failed", { reminderId, userId: user.id, error });
    return {
      success: false,
      message: "We couldn't delete that reminder. Please refresh and try again."
    };
  }

  revalidateUserData(user.id);
  return { success: true };
}

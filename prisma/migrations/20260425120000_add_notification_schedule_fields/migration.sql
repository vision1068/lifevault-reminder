ALTER TABLE "NotificationPreference"
ADD COLUMN "emailReminderTime" TEXT NOT NULL DEFAULT '12:00',
ADD COLUMN "emailTimeZone" TEXT NOT NULL DEFAULT 'Asia/Riyadh';

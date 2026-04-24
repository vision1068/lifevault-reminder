-- CreateEnum
CREATE TYPE "DateType" AS ENUM (
  'EXPIRY_DATE',
  'EVENT_DATE',
  'DUE_DATE',
  'RENEWAL_DATE',
  'SERVICE_DATE',
  'APPOINTMENT_DATE',
  'CUSTOM'
);

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM (
  'NONE',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY'
);

-- CreateEnum
CREATE TYPE "Priority" AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM (
  'ACTIVE',
  'COMPLETED',
  'RENEWED',
  'EXPIRED',
  'ARCHIVED'
);

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "iconName" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderItem" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "personName" TEXT,
  "vehicleName" TEXT,
  "mainDate" TIMESTAMP(3) NOT NULL,
  "dateType" "DateType" NOT NULL,
  "reminderBeforeDays" JSONB NOT NULL,
  "repeat" "RepeatType" NOT NULL DEFAULT 'NONE',
  "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
  "status" "ReminderStatus" NOT NULL DEFAULT 'ACTIVE',
  "notes" TEXT,
  "amount" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),

  CONSTRAINT "ReminderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RenewalHistory" (
  "id" TEXT NOT NULL,
  "reminderItemId" TEXT NOT NULL,
  "oldDate" TIMESTAMP(3) NOT NULL,
  "newDate" TIMESTAMP(3) NOT NULL,
  "renewedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,

  CONSTRAINT "RenewalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
  "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
  "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
  "googleCalendarEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "reminderId" TEXT,
  "channel" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "message" TEXT,

  CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_userId_key" ON "Category"("id", "userId");

-- CreateIndex
CREATE INDEX "ReminderItem_userId_mainDate_idx" ON "ReminderItem"("userId", "mainDate");

-- CreateIndex
CREATE INDEX "ReminderItem_userId_status_idx" ON "ReminderItem"("userId", "status");

-- CreateIndex
CREATE INDEX "ReminderItem_userId_priority_idx" ON "ReminderItem"("userId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderItem_id_userId_key" ON "ReminderItem"("id", "userId");

-- CreateIndex
CREATE INDEX "RenewalHistory_reminderItemId_renewedOn_idx" ON "RenewalHistory"("reminderItemId", "renewedOn");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_attemptedAt_idx" ON "NotificationLog"("userId", "attemptedAt");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderItem" ADD CONSTRAINT "ReminderItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderItem" ADD CONSTRAINT "ReminderItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RenewalHistory" ADD CONSTRAINT "RenewalHistory_reminderItemId_fkey" FOREIGN KEY ("reminderItemId") REFERENCES "ReminderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

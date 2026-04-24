import "server-only";

import nodemailer from "nodemailer";
import { format } from "date-fns";

type ReminderEmailInput = {
  to: string;
  recipientName?: string | null;
  reminderTitle: string;
  categoryName: string;
  mainDate: Date;
  notes?: string | null;
  daysRemaining: number;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  if (!host || !port || !user || !pass || !from) {
    throw new Error("Email reminder environment variables are not fully configured.");
  }

  return {
    host,
    port: Number(port),
    secure: process.env.SMTP_SECURE === "true" || Number(port) === 465,
    auth: {
      user,
      pass
    },
    from
  };
}

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter() {
  if (!transporterPromise) {
    const config = getSmtpConfig();
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth
      })
    );
  }

  return transporterPromise;
}

function getDueLabel(daysRemaining: number) {
  if (daysRemaining <= 0) return "today";
  if (daysRemaining === 1) return "tomorrow";
  return `in ${daysRemaining} days`;
}

export async function sendGeneralReminderEmail({
  to,
  recipientName,
  reminderTitle,
  categoryName,
  mainDate,
  notes,
  daysRemaining
}: ReminderEmailInput) {
  const transporter = await getTransporter();
  const { from } = getSmtpConfig();
  const dueLabel = getDueLabel(daysRemaining);
  const formattedDate = format(mainDate, "dd MMM yyyy");
  const greeting = recipientName?.trim() ? `Hi ${recipientName.trim()},` : "Hi,";
  const subject = `LifeVault Reminder: ${reminderTitle} is due ${dueLabel}`;
  const text = [
    greeting,
    "",
    `This is your LifeVault reminder for "${reminderTitle}".`,
    `Category: ${categoryName}`,
    `Date: ${formattedDate}`,
    `Due: ${dueLabel}`,
    notes ? `Notes: ${notes}` : null,
    "",
    "You can manage this reminder anytime in LifeVault Reminder."
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f8fc; padding: 24px; color: #0f172a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 32px; border: 1px solid rgba(148,163,184,0.2);">
        <p style="font-size: 14px; letter-spacing: 0.16em; text-transform: uppercase; color: #64748b; margin: 0 0 12px;">LifeVault Reminder</p>
        <h1 style="font-size: 28px; margin: 0 0 16px;">${reminderTitle}</h1>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">${greeting.replace(",", "")}, this is a general reminder that your item is due <strong>${dueLabel}</strong>.</p>
        <div style="background: #f8fafc; border-radius: 18px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px;"><strong>Category:</strong> ${categoryName}</p>
          <p style="margin: 0 0 8px;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 0;"><strong>Status:</strong> Due ${dueLabel}</p>
        </div>
        ${
          notes
            ? `<div style="margin-bottom: 20px;"><p style="margin: 0 0 8px; font-weight: 700;">Notes</p><p style="margin: 0; line-height: 1.6;">${notes}</p></div>`
            : ""
        }
        <p style="font-size: 14px; color: #64748b; margin: 0;">You are receiving this because email reminders are enabled in your LifeVault Reminder account.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}

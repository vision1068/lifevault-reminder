export const DEFAULT_CATEGORIES = [
  {
    name: "Personal Documents",
    iconName: "FileBadge",
    color: "#2563eb",
    description: "Passports, IDs, licenses, and personal records."
  },
  {
    name: "Family Documents",
    iconName: "Users",
    color: "#7c3aed",
    description: "Important documents for spouse, children, and dependents."
  },
  {
    name: "Vehicle",
    iconName: "Car",
    color: "#ea580c",
    description: "Insurance, registration, servicing, and inspections."
  },
  {
    name: "Health",
    iconName: "HeartPulse",
    color: "#dc2626",
    description: "Vaccinations, appointments, and wellness reminders."
  },
  {
    name: "Finance & Bills",
    iconName: "Wallet",
    color: "#0f766e",
    description: "Cards, fees, utilities, invoices, and due dates."
  },
  {
    name: "Home & Warranty",
    iconName: "House",
    color: "#0f766e",
    description: "Appliances, maintenance, and warranty renewals."
  },
  {
    name: "Subscription",
    iconName: "RefreshCw",
    color: "#db2777",
    description: "Streaming, software, memberships, and recurring plans."
  },
  {
    name: "Education",
    iconName: "GraduationCap",
    color: "#4f46e5",
    description: "School fees, registrations, exams, and certificates."
  },
  {
    name: "Family Events",
    iconName: "CalendarHeart",
    color: "#be123c",
    description: "Anniversaries, celebrations, and important family moments."
  },
  {
    name: "Birthdays",
    iconName: "Cake",
    color: "#f59e0b",
    description: "Birthdays for family, friends, and loved ones."
  },
  {
    name: "Travel",
    iconName: "Plane",
    color: "#0284c7",
    description: "Visas, bookings, trips, and travel documents."
  },
  {
    name: "Others",
    iconName: "FolderKanban",
    color: "#6b7280",
    description: "Flexible reminders for anything else you want to track."
  }
] as const;

export const DATE_TYPE_OPTIONS = [
  { value: "EXPIRY_DATE", label: "Expiry date" },
  { value: "EVENT_DATE", label: "Event date" },
  { value: "DUE_DATE", label: "Due date" },
  { value: "RENEWAL_DATE", label: "Renewal date" },
  { value: "SERVICE_DATE", label: "Service date" },
  { value: "APPOINTMENT_DATE", label: "Appointment date" },
  { value: "CUSTOM", label: "Custom" }
] as const;

export const REMINDER_BEFORE_OPTIONS = [
  { value: 0, label: "Same day" },
  { value: 1, label: "1 day before" },
  { value: 7, label: "7 days before" },
  { value: 15, label: "15 days before" },
  { value: 30, label: "30 days before" }
] as const;

export const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" }
] as const;

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "RENEWED", label: "Renewed" },
  { value: "EXPIRED", label: "Expired" },
  { value: "ARCHIVED", label: "Archived" }
] as const;

export const REPEAT_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" }
] as const;

export const NOTIFICATION_TIMEZONE_OPTIONS = [
  { value: "Asia/Riyadh", label: "Asia/Riyadh" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Asia/Qatar", label: "Asia/Qatar" },
  { value: "Asia/Kuwait", label: "Asia/Kuwait" },
  { value: "Asia/Bahrain", label: "Asia/Bahrain" },
  { value: "Asia/Muscat", label: "Asia/Muscat" },
  { value: "Asia/Karachi", label: "Asia/Karachi" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
  { value: "Asia/Singapore", label: "Asia/Singapore" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "UTC", label: "UTC" }
] as const;

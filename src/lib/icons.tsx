import {
  Bell,
  CalendarHeart,
  Cake,
  Car,
  FileBadge,
  FolderKanban,
  GraduationCap,
  HeartPulse,
  House,
  Plane,
  RefreshCw,
  ShieldCheck,
  Wallet,
  type LucideIcon,
  Users
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Bell,
  CalendarHeart,
  Cake,
  Car,
  FileBadge,
  FolderKanban,
  GraduationCap,
  HeartPulse,
  House,
  Plane,
  RefreshCw,
  ShieldCheck,
  Users,
  Wallet
};

export function getIconByName(name: string) {
  return iconMap[name] ?? FolderKanban;
}

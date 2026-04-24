import { ReminderStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { getReminderMetrics } from "@/lib/date-utils";

export function StatusBadge({
  status,
  mainDate
}: {
  status: ReminderStatus;
  mainDate?: Date;
}) {
  const metrics = mainDate ? getReminderMetrics(mainDate, status) : null;

  if (status === ReminderStatus.COMPLETED) {
    return <Badge variant="success">Completed</Badge>;
  }

  if (status === ReminderStatus.RENEWED) {
    return <Badge variant="info">Renewed</Badge>;
  }

  if (status === ReminderStatus.ARCHIVED) {
    return <Badge>Archived</Badge>;
  }

  if (status === ReminderStatus.EXPIRED || metrics?.isOverdue) {
    return <Badge variant="destructive">Overdue</Badge>;
  }

  if (metrics?.isDueToday) {
    return <Badge variant="warning">Due Today</Badge>;
  }

  if (metrics?.isDueSoon) {
    return <Badge variant="warning">Due Soon</Badge>;
  }

  return <Badge variant="success">Active</Badge>;
}

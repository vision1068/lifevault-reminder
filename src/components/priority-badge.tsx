import { Priority } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === Priority.CRITICAL) {
    return <Badge variant="destructive">Critical</Badge>;
  }

  if (priority === Priority.HIGH) {
    return <Badge variant="warning">High</Badge>;
  }

  if (priority === Priority.MEDIUM) {
    return <Badge variant="info">Medium</Badge>;
  }

  return <Badge>Low</Badge>;
}

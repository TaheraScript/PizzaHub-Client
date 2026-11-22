import {
  Ban,
  CheckCircle2,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; icon: LucideIcon; tone: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    tone: "bg-brand-amber/15 text-brand-amber",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    tone: "bg-brand-green/15 text-brand-green",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    tone: "bg-destructive/10 text-destructive",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    tone: "bg-muted text-muted-foreground",
  },
}

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  const { label, icon: Icon, tone } = ORDER_STATUS[status]

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        tone,
        className
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  )
}

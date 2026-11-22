import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

/**
 * Compact order status timeline (optional feature §18).
 * Placed → Accepted / Awaiting vendor, or Rejected / Cancelled.
 */
export function OrderTimeline({ status }: { status: OrderStatus }) {
  const terminal =
    status === "cancelled" || status === "rejected" ? status : null

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
      <span className="rounded-full bg-brand-green/15 px-2.5 py-1 text-brand-green">
        Placed
      </span>
      <span aria-hidden className="text-muted-foreground">
        →
      </span>
      {terminal ? (
        <span
          className={cn(
            "rounded-full px-2.5 py-1 capitalize",
            terminal === "rejected"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          )}
        >
          {terminal}
        </span>
      ) : (
        <span
          className={cn(
            "rounded-full px-2.5 py-1",
            status === "accepted"
              ? "bg-brand-green/15 text-brand-green"
              : "bg-brand-amber/15 text-brand-amber"
          )}
        >
          {status === "accepted" ? "Accepted" : "Awaiting vendor"}
        </span>
      )}
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CalendarClock,
  Check,
  Mail,
  MapPin,
  MessageSquare,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { MenuImage } from "@/components/menu/menu-image"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { updateVendorOrderStatus } from "@/lib/actions/order"
import { cn } from "@/lib/utils"
import type { Order } from "@/types"

const formatDate = (value: string) => {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function VendorOrderCard({ order }: { order: Order }) {
  const router = useRouter()
  const [pending, setPending] = useState<"accepted" | "rejected" | null>(null)

  const decide = async (status: "accepted" | "rejected") => {
    if (pending) return
    setPending(status)
    try {
      await updateVendorOrderStatus(order._id, status)
      toast.success(status === "accepted" ? "Order accepted" : "Order rejected")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the order"
      )
    } finally {
      setPending(null)
    }
  }

  return (
    <article
      className={cn(cardClass, "flex flex-col gap-4 p-4 sm:flex-row sm:gap-5")}
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
        <MenuImage
          src={order.itemImage}
          alt={order.itemName}
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {order.itemName}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {order.customerName ?? "Customer"}
            </p>
            {order.customerEmail ? (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                {order.customerEmail}
              </p>
            ) : null}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-muted-foreground">Delivery date</dt>
              <dd className="font-medium text-foreground">
                {formatDate(order.deliveryDate)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-muted-foreground">Delivery address</dt>
              <dd className="font-medium text-foreground">
                {order.deliveryAddress}
              </dd>
            </div>
          </div>
        </dl>

        {order.message ? (
          <p className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            <MessageSquare className="mt-0.5 size-4 shrink-0" />
            <span>{order.message}</span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            Requested {formatDate(order.createdAt)}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              ${Number(order.price).toFixed(2)}
            </span>
            {order.status === "pending" ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-brand-green text-white hover:bg-brand-green/90"
                  disabled={pending !== null}
                  onClick={() => decide("accepted")}
                >
                  <Check />
                  {pending === "accepted" ? "Accepting…" : "Accept"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending !== null}
                  onClick={() => decide("rejected")}
                >
                  <X />
                  {pending === "rejected" ? "Rejecting…" : "Reject"}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

import Link from "next/link"
import { CalendarClock, MapPin, MessageSquare, Package } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { MenuImage } from "@/components/menu/menu-image"
import { CancelOrderButton } from "@/components/orders/cancel-order-button"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Order } from "@/types"

// TODO: replace with a real fetch once the orders API + session auth are wired:
//   const orders = await getOrders({ customerId: session.user.id })
// See docs/REQUIREMENTS.md §9 and §13.
const dummyOrders: Order[] = [
  {
    _id: "ord_1001",
    itemId: "1",
    vendorId: "ven_01",
    customerId: "cus_01",
    itemName: "Pepperoni Feast",
    price: 14.5,
    vendorName: "Bella Italia",
    customerName: "Fatema",
    customerEmail: "fatema@example.com",
    deliveryDate: "2026-11-28",
    deliveryAddress: "12 Gulshan Avenue, Dhaka",
    message: "Extra cheese please, and ring the bell twice.",
    status: "pending",
    createdAt: "2026-11-20T10:15:00.000Z",
  },
  {
    _id: "ord_1002",
    itemId: "7",
    vendorId: "ven_02",
    customerId: "cus_01",
    itemName: "Garlic Bread with Cheese",
    price: 6.25,
    vendorName: "Slice House",
    customerName: "Fatema",
    customerEmail: "fatema@example.com",
    deliveryDate: "2026-11-25",
    deliveryAddress: "12 Gulshan Avenue, Dhaka",
    message: null,
    status: "accepted",
    createdAt: "2026-11-19T18:40:00.000Z",
  },
  {
    _id: "ord_1003",
    itemId: "12",
    vendorId: "ven_03",
    customerId: "cus_01",
    itemName: "Veggie Supreme",
    price: 12.0,
    vendorName: "Green Slice",
    customerName: "Fatema",
    customerEmail: "fatema@example.com",
    deliveryDate: "2026-11-18",
    deliveryAddress: "Flat 4B, Dhanmondi 27, Dhaka",
    message: "No olives.",
    status: "rejected",
    createdAt: "2026-11-15T09:05:00.000Z",
  },
  {
    _id: "ord_1004",
    itemId: "3",
    vendorId: "ven_01",
    customerId: "cus_01",
    itemName: "BBQ Chicken Pizza",
    price: 16.75,
    vendorName: "Bella Italia",
    customerName: "Fatema",
    customerEmail: "fatema@example.com",
    deliveryDate: "2026-11-12",
    deliveryAddress: "12 Gulshan Avenue, Dhaka",
    message: null,
    status: "cancelled",
    createdAt: "2026-11-10T13:30:00.000Z",
  },
]

const formatDate = (value: string) => {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function OrderCard({ order }: { order: Order }) {
  return (
    <article className={cn(cardClass, "flex flex-col gap-4 p-4 sm:flex-row sm:gap-5")}>
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
              {order.vendorName ?? "PizzaHub vendor"}
            </p>
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
              ${order.price.toFixed(2)}
            </span>
            {order.status === "pending" ? (
              <CancelOrderButton orderId={order._id} />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CustomerOrdersPage() {
  const orders = dummyOrders

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My orders"
        description="Track every order you've placed and cancel the ones still pending."
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your orders will show up here once you place one from the menu."
          action={
            <Button nativeButton={false} render={<Link href="/browse-menu" />}>
              Browse the menu
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

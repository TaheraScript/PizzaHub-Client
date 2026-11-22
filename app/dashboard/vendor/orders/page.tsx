import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { VendorOrderCard } from "@/components/vendor/vendor-order-card"
import { Button } from "@/components/ui/button"
import { getVendorOrders } from "@/lib/api/vendor"
import type { Order } from "@/types"

export default async function VendorOrdersPage() {
  let orders: Order[] | null = null
  try {
    orders = await getVendorOrders()
  } catch {
    orders = null
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer orders"
        description="Accept or reject incoming orders. Each pending order can only be actioned once."
      />

      {orders === null ? (
        <ErrorState
          title="Couldn't load your orders"
          description="We couldn't reach your orders right now. Please refresh and try again."
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When customers order from your menu, their orders will show up here."
          action={
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/vendor/menu-items" />}
            >
              Manage your menu
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <VendorOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

import Link from "next/link"
import { CheckCircle2, Clock, CreditCard, PackageCheck, UtensilsCrossed } from "lucide-react"

import { BarChart } from "@/components/dashboard/bar-chart"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { getVendorOverview, type VendorOverview } from "@/lib/api/vendor"
import { cn } from "@/lib/utils"

export default async function VendorDashboardPage() {
  let overview: VendorOverview | null = null
  try {
    overview = await getVendorOverview()
  } catch {
    overview = null
  }

  if (!overview) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Vendor dashboard"
          description="Manage your menu and orders at a glance."
        />
        <ErrorState
          title="Couldn't load your dashboard"
          description="We couldn't fetch your dashboard data. Please refresh and try again."
        />
      </div>
    )
  }

  const planLabel = overview.subscriptionPlan === "premium" ? "Premium" : "Free"
  const hasOrders = overview.pendingOrders + overview.acceptedOrders > 0

  const stats = [
    { label: "Menu items", value: overview.totalItems, icon: UtensilsCrossed },
    { label: "Active items", value: overview.activeItems, icon: CheckCircle2 },
    { label: "Pending orders", value: overview.pendingOrders, icon: Clock },
    { label: "Accepted orders", value: overview.acceptedOrders, icon: PackageCheck },
  ]

  const chart = [
    { label: "Menu items", value: overview.totalItems },
    { label: "Active", value: overview.activeItems },
    { label: "Pending", value: overview.pendingOrders },
    { label: "Accepted", value: overview.acceptedOrders },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vendor dashboard"
        description="Manage your menu and orders at a glance."
        action={
          <Badge size="md" variant="neutral">
            <CreditCard className="size-3.5" />
            {planLabel} plan
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={cn(cardClass, "p-5")}>
        <h2 className="text-sm font-bold tracking-tight text-foreground">
          Menu &amp; orders at a glance
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Item and order counts across your dashboard.
        </p>
        <div className="mt-5">
          <BarChart data={chart} />
        </div>
      </div>

      {!hasOrders ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No orders yet"
          description="Once customers order from your menu, their orders will appear here."
          action={
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/vendor/menu-items/add" />}
            >
              Add your first item
            </Button>
          }
        />
      ) : null}
    </div>
  )
}

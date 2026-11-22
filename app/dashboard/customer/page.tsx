import Link from "next/link"
import { CheckCircle2, Clock, Package, XCircle } from "lucide-react"

import { BarChart } from "@/components/dashboard/bar-chart"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { getCustomerOverview, type CustomerOverview } from "@/lib/api/customer"
import { cn } from "@/lib/utils"

export default async function CustomerDashboardPage() {
  let overview: CustomerOverview | null = null
  try {
    overview = await getCustomerOverview()
  } catch {
    overview = null
  }

  if (!overview) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Customer dashboard"
          description="Track your pizza orders in one place."
        />
        <ErrorState
          title="Couldn't load your dashboard"
          description="We couldn't fetch your order data. Please refresh and try again."
        />
      </div>
    )
  }

  const stats = [
    { label: "Total orders", value: overview.total, icon: Package },
    { label: "Pending", value: overview.pending, icon: Clock },
    { label: "Accepted", value: overview.accepted, icon: CheckCircle2 },
    { label: "Rejected", value: overview.rejected, icon: XCircle },
  ]

  const chart = [
    { label: "Total", value: overview.total },
    { label: "Pending", value: overview.pending },
    { label: "Accepted", value: overview.accepted },
    { label: "Rejected", value: overview.rejected },
    { label: "Cancelled", value: overview.cancelled },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer dashboard"
        description="Track your pizza orders in one place."
        action={
          <Button nativeButton={false} render={<Link href="/browse-menu" />}>
            Browse menu
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={cn(cardClass, "p-5")}>
        <h2 className="text-sm font-bold tracking-tight text-foreground">
          Orders at a glance
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Your orders broken down by status.
        </p>
        <div className="mt-5">
          <BarChart data={chart} />
        </div>
      </div>

      {overview.total === 0 ? (
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
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/customer/orders" />}
        >
          View all orders
        </Button>
      )}
    </div>
  )
}

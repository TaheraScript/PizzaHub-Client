import Link from "next/link"
import {
  Clock,
  Receipt,
  Store,
  UserCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react"

import { BarChart } from "@/components/dashboard/bar-chart"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { getAdminOverview, type AdminOverview } from "@/lib/api/admin"
import { cn } from "@/lib/utils"

export default async function AdminDashboardPage() {
  let overview: AdminOverview | null = null
  try {
    overview = await getAdminOverview()
  } catch {
    overview = null
  }

  if (!overview) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Admin dashboard"
          description="An overview of the whole platform."
        />
        <ErrorState
          title="Couldn't load platform data"
          description="We couldn't fetch the platform stats. Please refresh and try again."
        />
      </div>
    )
  }

  const stats = [
    { label: "Total users", value: overview.totalUsers, icon: Users },
    { label: "Vendors", value: overview.vendors, icon: Store },
    { label: "Customers", value: overview.customers, icon: UserCheck },
    { label: "Menu items", value: overview.totalItems, icon: UtensilsCrossed },
    { label: "Pending items", value: overview.pendingItems, icon: Clock },
    { label: "Transactions", value: overview.totalTransactions, icon: Receipt },
  ]

  const chart = [
    { label: "Vendors", value: overview.vendors },
    { label: "Customers", value: overview.customers },
    { label: "Items", value: overview.totalItems },
    { label: "Pending", value: overview.pendingItems },
    { label: "Txns", value: overview.totalTransactions },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin dashboard"
        description="An overview of the whole platform."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/admin/menu-items" />}
          >
            Review menu items
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={cn(cardClass, "p-5")}>
        <h2 className="text-sm font-bold tracking-tight text-foreground">
          Platform at a glance
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Key counts across users, menu items and transactions.
        </p>
        <div className="mt-5">
          <BarChart data={chart} />
        </div>
      </div>
    </div>
  )
}

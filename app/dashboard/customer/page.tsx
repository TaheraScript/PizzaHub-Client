import { CheckCircle2, Clock, Package, XCircle } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"

const stats = [
  { label: "Total orders", value: "0", icon: Package },
  { label: "Pending", value: "0", icon: Clock },
  { label: "Accepted", value: "0", icon: CheckCircle2 },
  { label: "Rejected", value: "0", icon: XCircle },
]

export default function CustomerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer dashboard"
        description="Track your pizza orders in one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Your orders will show up here once you place one from the menu."
      />
    </div>
  )
}

import {
  Clock,
  Receipt,
  Store,
  UserCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"

const stats = [
  { label: "Total users", value: "0", icon: Users },
  { label: "Vendors", value: "0", icon: Store },
  { label: "Customers", value: "0", icon: UserCheck },
  { label: "Menu items", value: "0", icon: UtensilsCrossed },
  { label: "Pending items", value: "0", icon: Clock },
  { label: "Transactions", value: "0", icon: Receipt },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin dashboard"
        description="An overview of the whole platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <EmptyState
        icon={UtensilsCrossed}
        title="Nothing to review"
        description="Pending menu items awaiting your approval will appear here."
      />
    </div>
  )
}

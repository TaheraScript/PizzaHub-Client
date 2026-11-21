import Link from "next/link"
import { CheckCircle2, Clock, CreditCard, UtensilsCrossed } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Menu items", value: "0", icon: UtensilsCrossed },
  { label: "Active items", value: "0", icon: CheckCircle2 },
  { label: "Pending orders", value: "0", icon: Clock },
  { label: "Current plan", value: "Free", icon: CreditCard },
]

export default function VendorDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vendor dashboard"
        description="Manage your menu and orders at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

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
    </div>
  )
}

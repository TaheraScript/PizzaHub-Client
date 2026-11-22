import Link from "next/link"
import { Plus, UtensilsCrossed } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { VendorMenuItemCard } from "@/components/vendor/vendor-menu-item-card"
import { Button } from "@/components/ui/button"
import { getMyMenuItems } from "@/lib/api/vendor"
import type { MenuItem } from "@/types/menu"

export default async function VendorMenuItemsPage() {
  let items: MenuItem[] | null = null
  try {
    items = await getMyMenuItems()
  } catch {
    items = null
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My menu items"
        description="Manage the items on your menu. New items stay pending until an admin approves them."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/vendor/menu-items/add" />}
          >
            <Plus />
            Add menu item
          </Button>
        }
      />

      {items === null ? (
        <ErrorState
          title="Couldn't load your menu items"
          description="We couldn't reach your menu right now. Please refresh and try again."
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No menu items yet"
          description="Add your first item to start selling on PizzaHub."
          action={
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/vendor/menu-items/add" />}
            >
              Add menu item
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <VendorMenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

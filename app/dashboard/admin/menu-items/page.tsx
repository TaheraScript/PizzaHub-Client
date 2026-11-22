import { PageHeader } from "@/components/dashboard/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { getAdminMenuItems } from "@/lib/api/admin"
import type { MenuItem } from "@/types/menu"

import { AdminMenuItems } from "./menu-items-client"

export default async function AdminMenuItemsPage() {
  let items: MenuItem[] | null = null
  try {
    items = await getAdminMenuItems()
  } catch {
    items = null
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage menu items"
        description="Review pending submissions, approve or reject them, and remove inappropriate items."
      />
      {items === null ? (
        <ErrorState
          title="Couldn't load menu items"
          description="We couldn't fetch the menu items. Please refresh and try again."
        />
      ) : (
        <AdminMenuItems items={items} />
      )}
    </div>
  )
}

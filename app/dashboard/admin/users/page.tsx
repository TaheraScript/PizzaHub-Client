import { PageHeader } from "@/components/dashboard/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { getAdminUsers, type AdminUser } from "@/lib/api/admin"

import { AdminUsers } from "./users-client"

export default async function AdminUsersPage() {
  let users: AdminUser[] | null = null
  try {
    users = await getAdminUsers()
  } catch {
    users = null
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage users"
        description="View all vendors and customers, search, and block or unblock accounts."
      />
      {users === null ? (
        <ErrorState
          title="Couldn't load users"
          description="We couldn't fetch the user list. Please refresh and try again."
        />
      ) : (
        <AdminUsers users={users} />
      )}
    </div>
  )
}

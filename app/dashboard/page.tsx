import { redirect } from "next/navigation"

import { requireSession } from "@/lib/core/server"

/**
 * Bare `/dashboard` has no page of its own — route the user to their
 * role-specific dashboard (vendor / customer / admin).
 */
export default async function DashboardRedirectPage() {
  const session = await requireSession()
  redirect(`/dashboard/${session.user.role}`)
}

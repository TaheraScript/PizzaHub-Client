import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type VendorOverview = {
  totalItems: number
  activeItems: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
  subscriptionPlan: "free" | "premium"
}

/** Counts for the signed-in vendor (the server scopes it from the JWT). */
export const getVendorOverview = async (): Promise<VendorOverview> => {
  const res = await authFetch(`${BASE_URL}/vendor/overview`)
  if (!res.ok) {
    throw new Error(`Failed to load dashboard overview (${res.status})`)
  }
  return res.json()
}

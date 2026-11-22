import type { MenuItem } from "@/types/menu"
import type { Order } from "@/types/order"
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

/** The signed-in vendor's own menu items (all approval statuses). */
export const getMyMenuItems = async (): Promise<MenuItem[]> => {
  const res = await authFetch(`${BASE_URL}/vendor/menu-items`)
  if (!res.ok) {
    throw new Error(`Failed to load your menu items (${res.status})`)
  }
  return res.json()
}

/** Incoming orders for the signed-in vendor. */
export const getVendorOrders = async (): Promise<Order[]> => {
  const res = await authFetch(`${BASE_URL}/vendor/orders`)
  if (!res.ok) {
    throw new Error(`Failed to load orders (${res.status})`)
  }
  return res.json()
}

import type { MenuItem } from "@/types/menu"
import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type AdminOverview = {
  totalUsers: number
  vendors: number
  customers: number
  totalItems: number
  pendingItems: number
  totalTransactions: number
}

export type AdminUser = {
  _id: string
  name?: string | null
  email?: string | null
  role?: string | null
  image?: string | null
  isBlocked?: boolean
  subscriptionPlan?: string | null
  businessName?: string | null
  createdAt?: string
}

export type Transaction = {
  _id: string
  vendorId?: string
  vendorName?: string | null
  vendorEmail?: string | null
  plan?: string
  amount?: number
  currency?: string
  stripeSessionId?: string
  status?: string
  createdAt?: string
}

async function getJson<T>(path: string): Promise<T> {
  const res = await authFetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json()
}

export const getAdminOverview = () => getJson<AdminOverview>("/admin/overview")
export const getAdminUsers = () => getJson<AdminUser[]>("/users")
export const getAdminMenuItems = (query = "") =>
  getJson<MenuItem[]>(`/admin/menu-items${query ? `?${query}` : ""}`)
export const getAdminTransactions = () =>
  getJson<Transaction[]>("/admin/transactions")

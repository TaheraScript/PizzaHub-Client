import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type CustomerOverview = {
  total: number
  pending: number
  accepted: number
  rejected: number
  cancelled: number
}

/** Order counts for the signed-in customer (scoped server-side from the JWT). */
export const getCustomerOverview = async (): Promise<CustomerOverview> => {
  const res = await authFetch(`${BASE_URL}/customer/overview`)
  if (!res.ok) {
    throw new Error(`Failed to load dashboard overview (${res.status})`)
  }
  return res.json()
}

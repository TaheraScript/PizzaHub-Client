'use server'
import type { CreateOrderInput, Order } from "@/types"
import { authFetch } from "../core/server"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

type OrderResponse = {
  insertedId?: string
  message?: string
}

type OrdersResponse = Order[] | { message?: string }

//order menu item(customer)
export const orderMenu = async (data: CreateOrderInput): Promise<OrderResponse> => {
    const api = `${BASE_URL}/orders?${query}`
  const res = await authFetch(api)
    return res.json()

 

//get orders (a customer's own orders, or a vendor's incoming orders)
export const getOrder = async (query = ""): Promise<Order[]> => {
  const search = query ? `?${query}` : ""
  const res = await fetch(`${BASE_URL}/orders${search}`, { cache: "no-store" })

  const body = (await res.json().catch(() => null)) as OrdersResponse | null

  if (!res.ok) {
    const message = body && !Array.isArray(body) ? body.message : undefined
    throw new Error(message || `Failed to load orders (${res.status})`)
  }

  return Array.isArray(body) ? body : []
}

//count customers order
export const getOrderCount = async (query = ""): Promise<{count:number}> => {
  const res = await fetch(`${BASE_URL}/orders/count?${query}`, { cache: "no-store" })

  return res.json()
}

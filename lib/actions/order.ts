'use server'
import type { CreateOrderInput, Order } from "@/types"
import { getToken, protectedMutation } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

type OrderResponse = {
  insertedId?: string
  message?: string
}

type OrdersResponse = Order[] | { message?: string }

//order menu item(customer)
export const orderMenu = async (data: CreateOrderInput): Promise<OrderResponse> => {
  const res = await protectedMutation(`${BASE_URL}/orders`, 'POST', data)
  return res.json()
}

//get orders (a customer's own orders, or a vendor's incoming orders)
export const getOrder = async (query = ""): Promise<Order[]> => {
  const token = await getToken()
  const search = query ? `?${query}` : ""
  const res = await fetch(`${BASE_URL}/orders${search}`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
  })

  const body = (await res.json().catch(() => null)) as OrdersResponse | null

  if (!res.ok) {
    const message = body && !Array.isArray(body) ? body.message : undefined
    throw new Error(message || `Failed to load orders (${res.status})`)
  }

  return Array.isArray(body) ? body : []
}

//count customers order
export const getOrderCount = async (query = ""): Promise<{count:number}> => {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}/orders/count?${query}`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
  })

  return res.json()
}

// customer cancels their own pending order
export const cancelOrder = async (orderId: string) => {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: 'cancelled' }),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body?.message || `Failed to cancel order (${res.status})`)
  }

  return body
}

// vendor: accept or reject one of their own pending orders
export const updateVendorOrderStatus = async (
  orderId: string,
  status: "accepted" | "rejected"
) => {
  const token = await getToken()
  const res = await fetch(
    `${BASE_URL}/vendor/orders/${encodeURIComponent(orderId)}`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  )

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body?.message || `Failed to update order (${res.status})`)
  }

  return body
}

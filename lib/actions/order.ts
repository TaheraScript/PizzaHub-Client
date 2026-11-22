import type { CreateOrderInput } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

type OrderResponse = {
  insertedId?: string
  message?: string
}

//order menu item(customer)
export const orderMenu = async (data: CreateOrderInput): Promise<OrderResponse> => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = (await res.json().catch(() => null)) as OrderResponse | null

  if (!res.ok) {
    throw new Error(body?.message || `Failed to place order (${res.status})`)
  }

  return body ?? {}
}

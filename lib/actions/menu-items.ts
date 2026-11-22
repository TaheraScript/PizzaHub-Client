'use server'

import { getToken } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// add menu item(vendor) — sends the vendor's JWT; the server assigns vendorId
// and the default "pending" status.
export const createMenu = async (data: unknown) => {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}/menu-items`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body?.message || `Failed to add menu item (${res.status})`)
  }

  return body
}

// update one of the vendor's own items (fields and/or availability status)
export const updateMenuItem = async (menuId: string, data: unknown) => {
  const token = await getToken()
  const res = await fetch(
    `${BASE_URL}/vendor/menu-items/${encodeURIComponent(menuId)}`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body?.message || `Failed to update menu item (${res.status})`)
  }

  return body
}

//delete menu item(vendor) — ownership enforced server-side
export const deleteMenu = async (menuId: string) => {
  const token = await getToken()
  const res = await fetch(
    `${BASE_URL}/vendor/menu-items/${encodeURIComponent(menuId)}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )

  const data = res.status === 204 ? {} : await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.message || `Failed to delete menu item (${res.status})`)
  }

  return data
}

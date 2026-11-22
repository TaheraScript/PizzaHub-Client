'use server'

import { getToken } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function patch(path: string, body: unknown) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`)
  }
  return data
}

// block / unblock a user
export const setUserBlocked = async (userId: string, isBlocked: boolean) =>
  patch(`/users/${encodeURIComponent(userId)}/block`, { isBlocked })

// approve / reject / change status of any menu item
export const setMenuItemStatus = async (
  itemId: string,
  status: 'pending' | 'approved' | 'rejected' | 'inactive'
) => patch(`/admin/menu-items/${encodeURIComponent(itemId)}`, { status })

// delete any menu item
export const deleteAdminMenuItem = async (itemId: string) => {
  const token = await getToken()
  const res = await fetch(
    `${BASE_URL}/admin/menu-items/${encodeURIComponent(itemId)}`,
    {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    }
  )
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || `Failed to delete item (${res.status})`)
  }
  return data
}

import type { MenuItem } from "@/types/menu"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Request failed (${res.status})`)
  }

  return res.json()
}

export const getMenu = async (query = ""): Promise<MenuItem[]> => {
  const search = query ? `?${query}` : ""
  return request<MenuItem[]>(`/menu-items${search}`)
}

export const getMenuLocations = async (): Promise<string[]> =>
  request<string[]>("/menu-items/locations")

export const getMenuItem = async (id: string): Promise<MenuItem> =>
  request<MenuItem>(`/menu-items/${encodeURIComponent(id)}`)

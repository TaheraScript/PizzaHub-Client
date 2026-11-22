export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive"

/** Image can be a URL/path or an object returned by some upload APIs. */
export type MenuItemImage = string | { url?: string } | null

export type MenuItem = {
  _id: string
  itemName: string
  category: string
  description: string
  price: number
  location: string
  image?: MenuItemImage
  /** Optional gallery; falls back to `image` when absent. */
  images?: string[]
  status: MenuItemStatus
  vendorId?: string
  vendorName?: string
  createdAt?: string
}

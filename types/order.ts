import type { MenuItemImage } from "./menu"

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled"

/**
 * A customer order.
 *
 * Field names follow the `orders` collection in docs/REQUIREMENTS.md §13.
 * The item/vendor/customer values are **snapshots** taken when the order is
 * placed, so editing or deleting a menu item later cannot corrupt order
 * history.
 */
export type Order = {
  _id: string

  // ── references ──────────────────────────────────────────
  itemId: string
  vendorId: string | null
  customerId: string

  // ── item snapshot ───────────────────────────────────────
  itemName: string
  itemImage?: MenuItemImage
  price: number

  // ── vendor / customer snapshot ──────────────────────────
  vendorName: string | null
  customerName: string | null
  customerEmail: string | null

  // ── delivery ────────────────────────────────────────────
  deliveryDate: string
  deliveryAddress: string
  message: string | null

  // ── meta ────────────────────────────────────────────────
  status: OrderStatus
  createdAt: string
}

/**
 * Body the client posts to `POST /order`.
 * The server derives the snapshots, `status`, and `createdAt` itself.
 */
export type CreateOrderInput = {
  itemId: string
  customerId: string
  customerName?: string
  customerEmail: string
  deliveryDate: string
  deliveryAddress: string
  message?: string
}

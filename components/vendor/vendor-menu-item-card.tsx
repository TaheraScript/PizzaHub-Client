"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { DeleteMenuDialog } from "@/components/DeleteMenuDialog"
import { MenuImage } from "@/components/menu/menu-image"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { updateMenuItem } from "@/lib/actions/menu-items"
import { cn } from "@/lib/utils"
import type { MenuItem, MenuItemStatus } from "@/types/menu"

const STATUS: Record<
  MenuItemStatus,
  { label: string; icon: LucideIcon; iconClass: string }
> = {
  pending: { label: "Pending", icon: Clock, iconClass: "text-brand-amber" },
  approved: { label: "Approved", icon: CheckCircle2, iconClass: "text-brand-green" },
  rejected: { label: "Rejected", icon: XCircle, iconClass: "text-destructive" },
  inactive: { label: "Inactive", icon: EyeOff, iconClass: "text-muted-foreground" },
}

export function VendorMenuItemCard({ item }: { item: MenuItem }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const status = STATUS[item.status]
  const canToggle = item.status === "approved" || item.status === "inactive"

  const toggleAvailability = async () => {
    if (pending) return
    setPending(true)
    try {
      const next = item.status === "approved" ? "inactive" : "approved"
      await updateMenuItem(item._id, { status: next })
      toast.success(
        next === "approved" ? "Item is now available" : "Item hidden from customers"
      )
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update availability"
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <article
      className={cn(
        cardClass,
        "group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <MenuImage
          src={item.image}
          alt={item.itemName}
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm ring-1 ring-border backdrop-blur">
          <status.icon className={cn("size-3.5", status.iconClass)} />
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-brand-orange">
              {item.category}
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold text-foreground">
              {item.itemName}
            </h3>
          </div>
          <span className="shrink-0 text-base font-bold text-foreground">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>

        <p className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{item.location}</span>
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            nativeButton={false}
            render={<Link href={`/dashboard/vendor/menu-items/${item._id}/edit`} />}
          >
            <Pencil />
            Edit
          </Button>
          <DeleteMenuDialog item={item} />
        </div>

        {canToggle ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAvailability}
            disabled={pending}
          >
            {item.status === "approved" ? <EyeOff /> : <Eye />}
            {item.status === "approved" ? "Hide from menu" : "Show on menu"}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

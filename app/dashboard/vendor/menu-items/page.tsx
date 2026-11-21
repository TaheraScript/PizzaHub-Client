"use client"

import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock,
  EyeOff,
  MapPin,
  Pencil,
  Plus,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getMenu } from "@/lib/api/menu"
import { DeleteMenuDialog } from "@/components/DeleteMenuDialog"

type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive"

// Mirrors what the "Add menu item" form collects, plus the server fields.
type MenuItem = {
  _id: string
  itemName: string
  category: string
  description: string
  price: number
  location: string
  image: StaticImageData | string
  status: MenuItemStatus
}

const STATUS: Record<
  MenuItemStatus,
  { label: string; icon: LucideIcon; iconClass: string }
> = {
  pending: { label: "Pending", icon: Clock, iconClass: "text-brand-amber" },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    iconClass: "text-brand-green",
  },
  rejected: { label: "Rejected", icon: XCircle, iconClass: "text-destructive" },
  inactive: {
    label: "Inactive",
    icon: EyeOff,
    iconClass: "text-muted-foreground",
  },
}

function MenuItemCard({
  item,
  onDeleted,
}: {
  item: MenuItem
  onDeleted: (id: string) => void
}) {
  const status = STATUS[item.status]

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden">
        {typeof item.image === "string" && item.image.length > 0 ? (
          <Image
            src={item.image}
            alt={item.itemName}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
            No image
          </div>
        )}
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
            ${item.price.toFixed(2)}
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
            onClick={() => toast.info("Edit item coming soon")}
          >
            <Pencil />
            Edit
          </Button>
          <DeleteMenuDialog item={item} onDeleted={onDeleted} />
        </div>
      </div>
    </article>
  )
}

export default function VendorMenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    let active = true

    getMenu()
      .then((data: MenuItem[]) => {
        if (active) setMenuItems(data)
      })
      .catch(() => toast.error("Failed to load menu items"))

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My menu items"
        description="Manage the items on your menu. New items stay pending until an admin approves them."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/vendor/menu-items/add" />}
          >
            <Plus />
            Add menu item
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            onDeleted={(id) =>
              setMenuItems((current) =>
                current.filter((menuItem) => menuItem._id !== id)
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

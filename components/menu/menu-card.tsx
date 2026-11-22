import Link from "next/link"
import { ArrowRight, MapPin, Store } from "lucide-react"

import { MenuImage } from "@/components/menu/menu-image"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types/menu"

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article
      className={cn(
        cardClass,
        "group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <MenuImage src={item.image} alt={item.itemName} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[0.7rem] font-bold tracking-wider text-brand-orange uppercase">
          {item.category}
        </span>

        <h3 className="truncate text-base font-extrabold tracking-wide text-foreground uppercase">
          {item.itemName}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="flex flex-col gap-1 pt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{item.location}</span>
          </span>
          {item.vendorName ? (
            <span className="flex items-center gap-1.5">
              <Store className="size-3.5 shrink-0" />
              <span className="truncate">{item.vendorName}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            ${Number(item.price).toFixed(2)}
          </span>
          <Button
            size="sm"
            nativeButton={false}
            className="h-9 rounded-full px-4 font-semibold"
            render={<Link href={`/menu/${item._id}`} />}
          >
            View details
            <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  )
}

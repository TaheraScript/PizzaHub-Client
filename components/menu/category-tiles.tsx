"use client"

import { LayoutGrid, Pizza } from "lucide-react"

import { cn } from "@/lib/utils"
import { CATEGORY_ICON } from "@/components/menu/category-icon"
import { ScrollRow } from "@/components/ui/scroll-row"
import { togglePillVariants } from "@/components/ui/toggle-pill"

type CategoryTilesProps = {
  categories: readonly string[]
  /** Currently selected category, or "" for "All". */
  value: string
  onChange: (category: string | null) => void
}

/** Compact tile labels — the full category name is kept in the tooltip. */
const SHORT_LABEL: Record<string, string> = {
  "Classic Pizzas": "Classic",
  "Vegetarian Pizzas": "Veggie",
  "Meat Lovers": "Meat",
  "Specialty / Gourmet Pizzas": "Gourmet",
  "Sides & Appetizers": "Sides",
  "Beverages & Desserts": "Drinks",
}

export function CategoryTiles({
  categories,
  value,
  onChange,
}: CategoryTilesProps) {
  const tiles = [
    { label: "All", fullLabel: "All categories", icon: LayoutGrid, value: "" },
    ...categories.map((category) => ({
      label: SHORT_LABEL[category] ?? category,
      fullLabel: category,
      icon: CATEGORY_ICON[category] ?? Pizza,
      value: category,
    })),
  ]

  return (
    <ScrollRow
      role="group"
      aria-label="Filter by category"
      className="gap-2.5"
    >
      {tiles.map((tile) => {
        const active = value === tile.value
        const Icon = tile.icon

        return (
          <button
            key={tile.fullLabel}
            type="button"
            title={tile.fullLabel}
            aria-pressed={active}
            onClick={() => onChange(active ? null : tile.value || null)}
            className={cn(
              "flex min-w-24 shrink-0 flex-col items-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold",
              togglePillVariants(active)
            )}
          >
            <Icon className="size-5" />
            <span className="truncate">{tile.label}</span>
          </button>
        )
      })}
    </ScrollRow>
  )
}

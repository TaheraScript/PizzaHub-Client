import type { Metadata } from "next"
import Link from "next/link"
import { SearchX, ServerCrash, SlidersHorizontal } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { MenuCard } from "@/components/menu/menu-card"
import { MenuFilters } from "@/components/menu/menu-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { getMenu, getMenuLocations } from "@/lib/api/menu"
import { MENU_CATEGORIES } from "@/lib/constants/menu"
import { firstValue } from "@/lib/utils"
import type { MenuItem, SearchParams } from "@/types"
import { FormEvent } from "react"

export const metadata: Metadata = {
  title: "Browse Menu",
  description:
    "Browse pizzas, sides and drinks from local PizzaHub vendors. Filter by category and area, or sort by price.",
}

export default async function BrowseMenuPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
    
  const params = await searchParams
  const search = firstValue(params.search)?.trim() ?? ""
  const category = firstValue(params.category) ?? ""
  const location = firstValue(params.location) ?? ""
  const sort = firstValue(params.sort) ?? ""

  const query = new URLSearchParams({ status: "approved" })
  if (search) query.set("search", search)
  if (category) query.set("category", category)
  if (location) query.set("location", location)
  if (sort) query.set("sort", sort)

  let items: MenuItem[] = []
  let locations: string[] = []
  let loadFailed = false

  try {
    ;[items, locations] = await Promise.all([
      getMenu(query.toString()),
      getMenuLocations(),
    ])
  } catch {
    loadFailed = true
  }

  const hasFilters = Boolean(search || category || location || sort)

  return (
    <PageContainer>
      <header className="max-w-2xl">
        <Badge>
          <SlidersHorizontal className="size-3.5" />
          Catalog
        </Badge>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
          Browse our menu
        </h1>
        <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
          Search fresh pizzas, sides and drinks from local vendors. Filter by
          category and area, or sort by price to find your next slice.
        </p>
      </header>

      <div className="mt-8">
        <MenuFilters categories={MENU_CATEGORIES} locations={locations} />
      </div>

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {loadFailed
          ? "Menu unavailable"
          : `${items.length} item${items.length === 1 ? "" : "s"} found`}
      </p>

      <div className="mt-4">
        {loadFailed ? (
          <EmptyState
            icon={ServerCrash}
            title="Could not load the menu"
            description="We couldn't reach the menu right now. Please check your connection and try again."
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No menu items found"
            description="Try a different search term, category or area, or reset the filters."
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/browse-menu" />}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

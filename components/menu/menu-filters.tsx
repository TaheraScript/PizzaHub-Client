"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, MapPin, Search, X } from "lucide-react"

import { CategoryTiles } from "@/components/menu/category-tiles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollRow } from "@/components/ui/scroll-row"
import { Select } from "@/components/ui/select"
import { TogglePill } from "@/components/ui/toggle-pill"
import { MENU_SORT_OPTIONS } from "@/lib/constants/menu"

type MenuFiltersProps = {
  categories: readonly string[]
  locations: string[]
}

type FilterUpdates = Record<string, string | null>

const SEARCH_DEBOUNCE_MS = 350

export function MenuFilters({ categories, locations }: MenuFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentSearch = searchParams.get("search") ?? ""
  const [query, setQuery] = useState(currentSearch)
  const currentCategory = searchParams.get("category") ?? ""
  const currentLocation = searchParams.get("location") ?? ""
  const currentSort = searchParams.get("sort") ?? ""
  const hasFilters = Boolean(
    currentSearch || currentCategory || currentLocation || currentSort
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const updateParams = (updates: FilterUpdates) => {
    // Read the live URL so a pending debounced search never overwrites a
    // category/location change made in the meantime.
    const params = new URLSearchParams(window.location.search)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })

    const query = params.toString()
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    })
  }

  const applySearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    updateParams({ search: value.trim() || null })
  }

  const scheduleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => updateParams({ search: value.trim() || null }),
      SEARCH_DEBOUNCE_MS
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
          const data = Object.fromEntries(formData.entries())
          console.log(data)
          const search = data.searchField
          const params = new URLSearchParams(window.location.search)
          params.set('search',search as string)
          router.push(`/browse-menu?${params.toString()}`)
    applySearch(searchRef.current?.value ?? "")
  }

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery("")
    startTransition(() => router.replace(pathname, { scroll: false }))
  }

  return (
    <section aria-label="Menu filters" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <form 
          onSubmit={handleSubmit}
          role="search"
          className="flex flex-1 items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              name="searchField"
              type="search"
              value={query}
              onValueChange={(value) => {
                setQuery(value)
                scheduleSearch(value)
              }}
              placeholder="Search pizzas, categories or areas..."
              aria-label="Search menu items"
              className="h-11 rounded-full pr-11 pl-11"
            />
            {isPending ? (
              <Loader2 className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            ) : null}
          </div>
          <Button
            type="submit"
            className="h-11 shrink-0 rounded-full px-5 font-semibold"
            aria-label="Apply search"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="hidden sm:inline">Search</span>
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Select
            value={currentSort}
            onChange={(event) =>
              updateParams({ sort: event.target.value || null })
            }
            aria-label="Sort menu items"
            className="w-full cursor-pointer rounded-full bg-card px-4 text-sm font-semibold text-foreground sm:w-auto"
          >
            {MENU_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="h-11 shrink-0 rounded-full px-4 font-semibold"
            >
              <X />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          ) : null}
        </div>
      </div>

      <CategoryTiles
        categories={categories}
        value={currentCategory}
        onChange={(category) => updateParams({ category })}
      />

      {locations.length > 0 ? (
        <ScrollRow role="group" aria-label="Filter by area">
          <TogglePill
            active={!currentLocation}
            onClick={() => updateParams({ location: null })}
          >
            <MapPin className="size-3.5" />
            All areas
          </TogglePill>
          {locations.map((location) => (
            <TogglePill
              key={location}
              active={currentLocation === location}
              onClick={() =>
                updateParams({
                  location: currentLocation === location ? null : location,
                })
              }
            >
              {location}
            </TogglePill>
          ))}
        </ScrollRow>
      ) : null}
    </section>
  )
}

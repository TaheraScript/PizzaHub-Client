"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { deleteAdminMenuItem, setMenuItemStatus } from "@/lib/actions/admin"
import { cn } from "@/lib/utils"
import type { MenuItem, MenuItemStatus } from "@/types/menu"

const STATUS_TONE: Record<MenuItemStatus, string> = {
  pending: "bg-brand-amber/15 text-brand-amber",
  approved: "bg-brand-green/15 text-brand-green",
  rejected: "bg-destructive/10 text-destructive",
  inactive: "bg-muted text-muted-foreground",
}

export function AdminMenuItems({ items }: { items: MenuItem[] }) {
  const router = useRouter()
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesStatus = !status || item.status === status
      const matchesSearch =
        !query ||
        (item.itemName ?? "").toLowerCase().includes(query) ||
        (item.category ?? "").toLowerCase().includes(query) ||
        (item.location ?? "").toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [items, status, search])

  const setStatusOf = async (item: MenuItem, next: MenuItemStatus) => {
    if (busyId) return
    setBusyId(item._id)
    try {
      await setMenuItemStatus(item._id, next)
      toast.success(`Item ${next}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update item")
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (item: MenuItem) => {
    if (busyId) return
    setBusyId(item._id)
    try {
      await deleteAdminMenuItem(item._id)
      toast.success("Item deleted")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete item")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search by name, category or area…"
            aria-label="Search menu items"
            className="h-11 rounded-full pr-4 pl-11"
          />
        </div>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
          className="h-11 rounded-full bg-card px-4 text-sm font-semibold sm:w-48"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No menu items match your filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((item) => (
            <li
              key={item._id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                      STATUS_TONE[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                  <h3 className="truncate font-semibold text-foreground">
                    {item.itemName}
                  </h3>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {item.category} · {item.location} ·{" "}
                  {item.vendorName ?? "Vendor"} · ${Number(item.price).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {item.status !== "approved" ? (
                  <Button
                    size="sm"
                    className="bg-brand-green text-white hover:bg-brand-green/90"
                    onClick={() => setStatusOf(item, "approved")}
                    disabled={busyId === item._id}
                  >
                    <Check />
                    Approve
                  </Button>
                ) : null}
                {item.status !== "rejected" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatusOf(item, "rejected")}
                    disabled={busyId === item._id}
                  >
                    <X />
                    Reject
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(item)}
                  disabled={busyId === item._id}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

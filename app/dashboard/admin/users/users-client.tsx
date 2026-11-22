"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ShieldCheck, ShieldOff } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { setUserBlocked } from "@/lib/actions/admin"
import { cn } from "@/lib/utils"
import type { AdminUser } from "@/lib/api/admin"

const ROLE_VARIANT: Record<string, "brand" | "neutral"> = {
  admin: "brand",
  vendor: "brand",
  customer: "neutral",
}

function initials(name?: string | null) {
  if (!name) return "U"
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  )
}

export function AdminUsers({ users }: { users: AdminUser[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesRole = !role || user.role === role
      const matchesSearch =
        !query ||
        (user.name ?? "").toLowerCase().includes(query) ||
        (user.email ?? "").toLowerCase().includes(query)
      return matchesRole && matchesSearch
    })
  }, [users, search, role])

  const toggleBlock = async (user: AdminUser) => {
    if (busyId) return
    setBusyId(user._id)
    try {
      await setUserBlocked(user._id, !user.isBlocked)
      toast.success(user.isBlocked ? "User unblocked" : "User blocked")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update user"
      )
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
            placeholder="Search by name or email…"
            aria-label="Search users"
            className="h-11 rounded-full pr-4 pl-11"
          />
        </div>
        <Select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          aria-label="Filter by role"
          className="h-11 rounded-full bg-card px-4 text-sm font-semibold sm:w-48"
        >
          <option value="">All roles</option>
          <option value="vendor">Vendors</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No users match your filters.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((user) => (
              <li
                key={user._id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name ?? "User"} />
                    ) : null}
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name ?? "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        size="sm"
                        variant={ROLE_VARIANT[user.role ?? ""] ?? "neutral"}
                      >
                        {user.role ?? "customer"}
                      </Badge>
                      {user.isBlocked ? (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                          Blocked
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBlock(user)}
                  disabled={busyId === user._id}
                  className={cn(
                    "shrink-0",
                    !user.isBlocked &&
                      "text-destructive hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  {user.isBlocked ? <ShieldCheck /> : <ShieldOff />}
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

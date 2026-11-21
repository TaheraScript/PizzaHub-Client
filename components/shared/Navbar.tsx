"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react"

import { authClient, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/Logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Role = "customer" | "vendor" | "admin"

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

const DASHBOARD_HREF: Record<Role, string> = {
  customer: "/dashboard/customer",
  vendor: "/dashboard/vendor",
  admin: "/dashboard/admin",
}

/** Role specific shortcut shown in the navbar next to Home / Browse Menu. */
const ROLE_LINK: Record<Role, { href: string; label: string }> = {
  customer: { href: "/dashboard/customer/orders", label: "My Orders" },
  vendor: { href: "/dashboard/vendor/menu-items", label: "My Menu" },
  admin: { href: "/dashboard/admin/users", label: "Manage Users" },
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

function getInitials(name?: string | null) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

  return initials || "PH"
}

function navLinkClass(active: boolean) {
  return cn(
    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors outline-none",
    "focus-visible:ring-3 focus-visible:ring-ring/50",
    active
      ? "bg-primary/15 text-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: session, isPending } = useSession()
  const user = session?.user as SessionUser | undefined
  const isLoggedIn = Boolean(user)

  const role: Role =
    user?.role === "vendor" || user?.role === "admin" || user?.role === "customer"
      ? user.role
      : "customer"

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
    ...(isLoggedIn ? [{ href: ROLE_LINK[role].href, label: ROLE_LINK[role].label }] : []),
  ]

  const initials = getInitials(user?.name)

  const handleSignOut = async () => {
    await authClient.signOut()
    setMobileOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={navLinkClass(isActive(pathname, link.href))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {isPending ? (
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="size-9 animate-pulse rounded-full bg-muted" />
              <span className="hidden h-8 w-20 animate-pulse rounded-full bg-muted md:block" />
            </div>
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:pr-2.5"
              >
                <Avatar size="lg" className="size-9">
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                  ) : null}
                  <AvatarFallback className="bg-primary/20 text-xs font-bold text-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm font-semibold md:block">
                  {user?.name}
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64!">
                <DropdownMenuLabel className="px-2 py-2">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {user?.name}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem render={<Link href={DASHBOARD_HREF[role]} />}>
                  <LayoutDashboard />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <Settings />
                  Profile Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" render={<Link href="/sign-in" />}>
                Sign In
              </Button>
              <Button
                className="font-semibold shadow-sm"
                render={<Link href="/sign-up" />}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(20rem,85vw)] gap-0 p-0"
            >
              <SheetHeader className="border-b border-border/80 px-5 py-4">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <Logo size="sm" />
              </SheetHeader>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Mobile">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(pathname, link.href)
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {isLoggedIn && (
                  <>
                    <Link
                      href={DASHBOARD_HREF[role]}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Profile Settings
                    </Link>
                  </>
                )}
              </nav>

              <Separator />

              <div className="p-4">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg" className="size-10">
                        {user?.image ? (
                          <AvatarImage src={user.image} alt={user.name ?? "User"} />
                        ) : null}
                        <AvatarFallback className="bg-primary/20 text-xs font-bold text-foreground">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user?.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      render={<Link href="/sign-in" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full font-semibold"
                      render={<Link href="/sign-up" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

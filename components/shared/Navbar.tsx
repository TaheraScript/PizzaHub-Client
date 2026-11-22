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
} from "lucide-react"

import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/Logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
}

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

function initials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U"
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
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
    user?.role === "vendor" || user?.role === "admin" ? user.role : "customer"

  const LINKS = [
    { href: "/", label: "Home" },
    { href: "/browse-menu", label: "Browse Menu" },
    ...(isLoggedIn ? [{ href: `/dashboard/${role}`, label: "Dashboard" }] : []),
  ]

  const handleSignOut = async () => {
    await signOut()
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
          {LINKS.map((link) => (
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
              <span className="hidden h-8 w-24 animate-pulse rounded-full bg-muted md:block" />
            </div>
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="hidden h-10 gap-2 rounded-full pr-2.5 pl-1.5 md:inline-flex"
                  >
                    <Avatar size="sm">
                      {user?.image ? (
                        <AvatarImage
                          src={user.image}
                          alt={user.name ?? "Profile"}
                        />
                      ) : null}
                      <AvatarFallback>{initials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-32 truncate text-sm font-semibold">
                      {user?.name}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-60">
                <div className="flex items-center gap-2.5 p-2">
                  <Avatar size="lg">
                    {user?.image ? (
                      <AvatarImage
                        src={user.image}
                        alt={user.name ?? "Profile"}
                      />
                    ) : null}
                    <AvatarFallback>{initials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.name}
                    </p>
                    {user?.email ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    ) : null}
                    <span className="mt-1 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                      {ROLE_LABEL[role]}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={`/dashboard/${role}`} />}>
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
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" nativeButton={false} render={<Link href="/sign-in" />}>
                Sign In
              </Button>
              <Button
                className="font-semibold shadow-sm"
                nativeButton={false}
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
                {LINKS.map((link) => (
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
              </nav>

              <Separator />

              <div className="p-4">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        {user?.image ? (
                          <AvatarImage
                            src={user.image}
                            alt={user.name ?? "Profile"}
                          />
                        ) : null}
                        <AvatarFallback>{initials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <p className="truncate text-sm font-semibold">{user?.name}</p>
                      <span className="ml-auto shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                        {ROLE_LABEL[role]}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      nativeButton={false}
                      render={<Link href="/profile" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Settings />
                      Profile Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      nativeButton={false}
                      render={<Link href="/sign-in" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full font-semibold"
                      nativeButton={false}
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

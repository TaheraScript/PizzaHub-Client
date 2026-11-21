"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, Menu as MenuIcon } from "lucide-react"

import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
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
  role?: string | null
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
    { href: "/menu", label: "Browse Menu" },
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
            <div className="hidden items-center gap-2.5 md:flex">
              <span className="max-w-40 truncate text-sm font-semibold">{user?.name}</span>
              <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                {ROLE_LABEL[role]}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut />
                Sign Out
              </Button>
            </div>
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
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{user?.name}</p>
                      <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                        {ROLE_LABEL[role]}
                      </span>
                    </div>
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

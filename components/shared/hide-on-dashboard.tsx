"use client"

import { usePathname } from "next/navigation"

/**
 * The dashboard (§8) is a full-height app shell (`min-h-svh`) with a `fixed`
 * sidebar, so the global marketing footer (§4) lands below a whole viewport of
 * empty space and is overlapped by the fixed sidebar. Render it only outside
 * the dashboard — the public/marketing pages keep it.
 */
export function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith("/dashboard")) {
    return null
  }
  return <>{children}</>
}

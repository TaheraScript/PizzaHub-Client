import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

/**
 * Optimistic page protection (Next 16 "Proxy", formerly middleware).
 *
 * This only checks that a session cookie is *present* — it is a fast,
 * pre-render redirect for UX. The authoritative check (valid session + role +
 * not blocked) still runs server-side in the dashboard layouts and on the
 * Express API. See `lib/core/server.ts`.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/menu/:path*", "/checkout/:path*"],
}

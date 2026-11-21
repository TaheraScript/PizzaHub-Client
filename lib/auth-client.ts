import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

/**
 * Single Better Auth client for the browser.
 * The auth API lives in the same Next.js app (`/api/auth/*`), so no baseURL is
 * required — Better Auth falls back to the current origin.
 * `inferAdditionalFields` exposes the server's custom user fields (role, ...).
 */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient

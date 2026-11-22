import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth"

const PREMIUM_PRICE_ID =
  process.env.STRIPE_PREMIUM_PRICE_ID ?? "price_1UeYs6FP1VXi3m3duKOIIzd7"

/**
 * Create a Stripe Checkout session for the signed-in **vendor** (§10).
 * The vendor identity comes from the session — never from the request body.
 */
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to start a checkout" },
      { status: 401 }
    )
  }
  if (session.user.role !== "vendor") {
    return NextResponse.json(
      { error: "Only vendors can purchase a subscription" },
      { status: 403 }
    )
  }

  const headersList = await headers()
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      metadata: { vendorId: session.user.id },
      line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    if (!checkout.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 }
      )
    }

    return NextResponse.redirect(checkout.url, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

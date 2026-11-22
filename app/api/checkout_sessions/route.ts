import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

export async function POST() {
  const userSession = await auth.api.getSession({ headers: await headers() })
  try {
    if (!userSession) {
      return NextResponse.json(
        { error: 'You must be signed in to start a checkout' },
        { status: 401 }
      )
    }

    const headersList = await headers()
    const origin =
      headersList.get('origin') ??
      process.env.NEXT_PUBLIC_APP_URL ??
      'http://localhost:3000'

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      "customer_email": userSession?.user.email,
      metadata:{
        userId:userSession?.user.id
      },
      line_items: [
        {
          // TODO: move this Price ID into STRIPE_PREMIUM_PRICE_ID in .env
          price:
            process.env.STRIPE_PREMIUM_PRICE_ID ??
            'price_1UeYs6FP1VXi3m3duKOIIzd7',
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

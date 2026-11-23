import 'server-only'

import Stripe from 'stripe'

let client: Stripe | undefined

/**
 * Lazily construct the Stripe client. Building it at module scope throws during
 * `next build` (page-data collection) whenever STRIPE_SECRET_KEY isn't set in
 * the build environment, so we defer creation until it's actually used.
 */
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    client = new Stripe(key)
  }
  return client
}

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getDb } from "@/lib/mongo"
import { stripe } from "@/lib/stripe"

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const PREMIUM_DAYS = 30

/**
 * Stripe webhook — the ONLY place Premium gets activated (§10/§22).
 * Verifies the signature, records the transaction idempotently, then upgrades
 * the vendor. The frontend success redirect never activates anything.
 */
export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 500 }
    )
  }

  const signature = (await headers()).get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  const rawBody = await request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    const db = await getDb()
    const users = db.collection("user")
    const transactions = db.collection("transactions")

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object
      const vendorId = checkout.metadata?.vendorId
      const paid =
        checkout.payment_status === "paid" || checkout.status === "complete"

      if (vendorId && paid) {
        const existing = await transactions.findOne({
          stripeSessionId: checkout.id,
        })

        if (!existing) {
          await transactions.insertOne({
            vendorId,
            plan: "premium",
            amount: checkout.amount_total ?? null,
            currency: checkout.currency ?? "usd",
            stripeSessionId: checkout.id,
            stripeSubscriptionId:
              typeof checkout.subscription === "string"
                ? checkout.subscription
                : null,
            status: checkout.payment_status ?? "paid",
            createdAt: new Date(),
          })
        }

        if (/^[0-9a-fA-F]{24}$/.test(String(vendorId))) {
          await users.updateOne(
            { _id: new ObjectId(vendorId) },
            {
              $set: {
                subscriptionPlan: "premium",
                subscriptionExpiresAt: new Date(
                  Date.now() + PREMIUM_DAYS * 24 * 60 * 60 * 1000
                ),
              },
            }
          )
        }
      }
    }

    const downgradeBySubscription = async (subscriptionId: string | null) => {
      if (!subscriptionId) return
      const transaction = await transactions.findOne({
        stripeSubscriptionId: subscriptionId,
      })
      if (
        transaction?.vendorId &&
        /^[0-9a-fA-F]{24}$/.test(String(transaction.vendorId))
      ) {
        await users.updateOne(
          { _id: new ObjectId(transaction.vendorId) },
          { $set: { subscriptionPlan: "free", subscriptionExpiresAt: null } }
        )
      }
    }

    if (event.type === "customer.subscription.deleted") {
      await downgradeBySubscription(event.data.object.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook handler failed:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

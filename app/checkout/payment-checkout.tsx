"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  Crown,
  Info,
  Pencil,
  Send,
  ShieldCheck,
  Store,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { CheckoutSteps } from "@/app/checkout/checkout-steps"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  CURRENCY,
  PREMIUM_PLANS,
  TAX_RATE,
  type BillingCycle,
} from "@/lib/constants/payment"
import { cn } from "@/lib/utils"

type PaymentCheckoutProps = {
  user: {
    name?: string | null
    email: string
    role?: string
  }
}

type PaymentMethodId = "card" | "wallet"

const PAYMENT_METHODS: {
  id: PaymentMethodId
  name: string
  description: string
  badge?: string
  icon: LucideIcon
  note?: string
}[] = [
  {
    id: "card",
    name: "Credit or debit card",
    description: "Visa, Mastercard, American Express",
    badge: "Recommended",
    icon: CreditCard,
    note: "You'll continue to Stripe to enter your card details. PizzaHub never sees or stores them.",
  },
  {
    id: "wallet",
    name: "Digital wallet",
    description: "Apple Pay or Google Pay",
    icon: Wallet,
  },
]

const CYCLES: BillingCycle[] = ["monthly", "yearly"]

const money = (value: number) => `$${value.toFixed(2)}`

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

export function PaymentCheckout({ user }: PaymentCheckoutProps) {
  const router = useRouter()
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  const [method, setMethod] = useState<PaymentMethodId>("card")
  const [promo, setPromo] = useState("")

  const plan = PREMIUM_PLANS[cycle]
  const subtotal = plan.price
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const handleApplyPromo = () => {
    if (!promo.trim()) {
      toast.error("Enter a promotion code first")
      return
    }
    toast.info("Promotion codes are coming soon")
  }

  const displayName = user.name ?? user.email
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Back
        </Button>

        <CheckoutSteps current={3} />

        <div className="hidden items-center gap-2 sm:flex">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-orange text-xs font-bold text-white">
            {initial}
          </span>
          <span className="max-w-28 truncate text-sm font-medium text-foreground">
            {displayName}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — payment information */}
        <div className={cn(cardClass, "flex flex-col gap-5 p-4 sm:p-5 lg:col-span-2")}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Payment information
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your payment details before proceeding.
              </p>
            </div>

            <div
              role="group"
              aria-label="Billing cycle"
              className="inline-flex rounded-full border border-border bg-muted p-1"
            >
              {CYCLES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={cycle === option}
                  onClick={() => setCycle(option)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors",
                    cycle === option
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Account row */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background">
              <Store className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name ?? "Your business"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Edit account details"
              onClick={() => toast.info("Editing account details is coming soon")}
            >
              <Pencil />
            </Button>
          </div>

          {/* Payment methods */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-foreground">
              Payment methods available
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose how you want to pay for your subscription.
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-brand-amber/10 p-3 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-amber" />
            <p className="text-foreground">
              Amounts are in {CURRENCY}. Card details are collected on Stripe&apos;s
              secure checkout, never on PizzaHub.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((option) => {
              const selected = option.id === method
              const Icon = option.icon

              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-colors",
                    selected
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-border bg-card hover:border-brand-orange/40"
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option.id}
                    checked={selected}
                    onChange={() => setMethod(option.id)}
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-foreground text-background">
                      <Icon className="size-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {option.name}
                        </span>
                        {option.badge ? <Badge>{option.badge}</Badge> : null}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2",
                        selected
                          ? "border-brand-orange"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {selected ? (
                        <span className="size-2.5 rounded-full bg-brand-orange" />
                      ) : null}
                    </span>
                  </div>

                  {selected && option.note ? (
                    <p className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                      <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand-green" />
                      {option.note}
                    </p>
                  ) : null}
                </label>
              )
            })}
          </div>

          <div className="mt-1 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Back to account
            </Button>
            <form action="/api/checkout_sessions" method="POST">
              <Button
                type="submit"
                className="bg-brand-orange font-semibold text-white hover:bg-brand-orange/90"
              >
                Continue to payment
              </Button>
            </form>
          </div>
        </div>

        {/* Right — order summary */}
        <div className={cn(cardClass, "flex h-fit flex-col gap-5 p-4 sm:p-5")}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold tracking-tight text-foreground">
              Order summary
            </h2>
            <Info className="size-4 shrink-0 text-muted-foreground" />
          </div>

          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <Crown className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-brand-orange uppercase">
                Subscription
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {plan.name}
              </p>
              <p className="text-sm text-muted-foreground">{plan.interval}</p>
            </div>
            <span className="shrink-0 text-sm font-bold text-foreground">
              {money(plan.price)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Promotion code
            </h3>
            <div className="flex items-center gap-2">
              <Input
                value={promo}
                onChange={(event) => setPromo(event.target.value)}
                placeholder="Add promo code"
                aria-label="Promotion code"
                className="h-10"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                aria-label="Apply promotion code"
                onClick={handleApplyPromo}
              >
                <Send />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <SummaryRow label="Subtotal" value={money(subtotal)} />
            <SummaryRow label={`Tax (${TAX_RATE * 100}%)`} value={money(tax)} />
            <div className="mt-1 flex items-center justify-between gap-4 border-t border-border pt-3">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-xl font-extrabold tracking-tight text-brand-orange">
                {money(total)}
              </span>
            </div>
          </div>

          <p className="rounded-xl bg-brand-cream/60 p-3 text-xs leading-relaxed text-muted-foreground">
            Your subscription activates only after Stripe confirms the payment.
            You can cancel anytime from your subscription settings.
          </p>
        </div>
      </div>
    </div>
  )
}

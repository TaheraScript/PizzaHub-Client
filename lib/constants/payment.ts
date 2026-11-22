export const CURRENCY = "USD"
export const TAX_RATE = 0.05

export type BillingCycle = "monthly" | "yearly"

export type PremiumPlan = {
  id: BillingCycle
  name: string
  price: number
  interval: string
  badge?: string
  description: string
}

export const PREMIUM_PLANS: Record<BillingCycle, PremiumPlan> = {
  monthly: {
    id: "monthly",
    name: "Premium — Monthly",
    price: 9.99,
    interval: "per month",
    description: "Unlimited menu items, Premium badge and featured placement.",
  },
  yearly: {
    id: "yearly",
    name: "Premium — Yearly",
    price: 99,
    interval: "per year",
    badge: "Best value",
    description: "Everything in Monthly, billed yearly — two months free.",
  },
}

import Link from "next/link"
import { Check, CreditCard, Sparkles } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { getVendorOverview, type VendorOverview } from "@/lib/api/vendor"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: [
      "Up to 3 active menu items",
      "Basic vendor dashboard",
      "Order management",
    ],
  },
  {
    name: "Premium",
    price: "$20",
    period: "per month",
    highlight: true,
    features: [
      "Unlimited active menu items",
      "Premium vendor badge",
      "Featured placement on the homepage",
      "Everything in Free",
    ],
  },
]

export default async function SubscriptionPage() {
  let overview: VendorOverview | null = null
  try {
    overview = await getVendorOverview()
  } catch {
    overview = null
  }

  if (!overview) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Subscription"
          description="Manage your vendor plan."
        />
        <ErrorState
          title="Couldn't load your plan"
          description="We couldn't fetch your subscription details. Please refresh and try again."
        />
      </div>
    )
  }

  const isPremium = overview.subscriptionPlan === "premium"

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subscription"
        description="Upgrade to Premium for unlimited menu items and featured placement."
        action={
          <Badge size="md" variant="neutral">
            <CreditCard className="size-3.5" />
            {isPremium ? "Premium" : "Free"} plan
          </Badge>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        {PLANS.map((plan) => {
          const current = (plan.name === "Premium") === isPremium

          return (
            <div
              key={plan.name}
              className={cn(
                cardClass,
                "flex flex-col gap-4 p-6",
                plan.highlight && "border-brand-orange ring-1 ring-brand-orange/30"
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{plan.name}</h2>
                {plan.highlight ? (
                  <Badge>
                    <Sparkles className="size-3.5" />
                    Premium
                  </Badge>
                ) : null}
              </div>

              <p className="text-3xl font-extrabold tracking-tight text-foreground">
                {plan.price}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / {plan.period}
                </span>
              </p>

              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-green" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {current ? (
                  <Button disabled className="w-full">
                    {plan.name === "Free"
                      ? "Your current plan"
                      : "You're on Premium"}
                  </Button>
                ) : plan.name === "Premium" ? (
                  <form action="/api/checkout_sessions" method="post">
                    <Button
                      type="submit"
                      className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
                    >
                      Upgrade to Premium
                    </Button>
                  </form>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    Contact support to downgrade
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Premium is activated only after Stripe confirms a verified payment.{" "}
        <Link href="/dashboard/vendor" className="underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  )
}

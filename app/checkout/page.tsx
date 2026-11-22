import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CreditCard, Info } from "lucide-react"

import { PaymentCheckout } from "@/app/checkout/payment-checkout"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import type { SearchParams } from "@/types"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your PizzaHub Premium subscription payment securely.",
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
    const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }

  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user?.isBlocked) {
    redirect("/unauthorized")
  }

  return (
    <div className="flex flex-col gap-6">
      {canceled ? (
        <div className="flex items-start gap-2 rounded-xl bg-brand-amber/10 p-3 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-brand-amber" />
          <p className="text-foreground">
            Your payment was canceled — you haven&apos;t been charged. Continue
            whenever you&apos;re ready.
          </p>
        </div>
      ) : null}

      {!session?.user ? (
        <EmptyState
          icon={CreditCard}
          title="Sign in to continue"
          description="You need to be signed in to complete a payment."
          action={
            <Button
              nativeButton={false}
              render={<Link href="/sign-in?redirectTo=/checkout" />}
            >
              Sign in
            </Button>
          }
        />
      ) : (
        <PaymentCheckout
          user={{
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          }}
        />
      )}
    </div>
  )
}

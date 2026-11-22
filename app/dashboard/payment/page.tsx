import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { CreditCard } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PaymentCheckout } from "@/app/checkout/payment-checkout"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete your PizzaHub Premium subscription payment securely.",
}

export default async function PaymentPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return (
      <EmptyState
        icon={CreditCard}
        title="Sign in to continue"
        description="You need to be signed in to complete a payment."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/sign-in?redirectTo=/dashboard/payment" />}
          >
            Sign in
          </Button>
        }
      />
    )
  }

  return (
    <PaymentCheckout
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    />
  )
}

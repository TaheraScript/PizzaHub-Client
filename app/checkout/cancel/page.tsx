import type { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Payment canceled",
}

export default function CheckoutCancelPage() {
  return (
    <PageContainer className="max-w-lg">
      <div
        className={cn(
          cardClass,
          "flex flex-col items-center gap-3 p-8 text-center"
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-amber/15 text-brand-amber">
          <XCircle className="size-7" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment canceled
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Your payment was canceled and you haven&apos;t been charged. You can
          upgrade to Premium whenever you&apos;re ready.
        </p>

        <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/vendor/subscription" />}
          >
            Back to subscription
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/vendor" />}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

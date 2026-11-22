import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  BadgeCheck,
  CreditCard,
  Hash,
  Mail,
  Receipt,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

import { stripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { cardClass } from '@/components/ui/card'
import { PageContainer } from '@/components/ui/page-container'
import { cn } from '@/lib/utils'
import type { SearchParams } from '@/types'

export const metadata: Metadata = {
  title: 'Payment successful',
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: LucideIcon
  label: string
  value: string | null | undefined
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="inline-flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        {label}
      </dt>
      <dd
        className={cn(
          'min-w-0 text-right text-sm font-semibold text-foreground',
          mono && 'font-mono text-xs break-all'
        )}
      >
        {value ?? '—'}
      </dd>
    </div>
  )
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  if (typeof session_id !== 'string')
    throw new Error('Invalid session_id')

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  const { status, customer_details, payment_status } = session

  if (status === 'open') {
    return redirect('/')
  }

  // `payment_intent` is expanded above, so it's a full object rather than an id.
  const paymentIntent =
    typeof session.payment_intent === 'string' ? null : session.payment_intent
  const transactionId = paymentIntent?.id

  const amountTotal =
    session.amount_total != null
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: (session.currency ?? 'usd').toUpperCase(),
        }).format(session.amount_total / 100)
      : null

  if (status === 'complete' && payment_status === 'paid') {
    return (
      <PageContainer className="max-w-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-brand-green/15 text-brand-green">
            <BadgeCheck className="size-8" />
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green">
            <BadgeCheck className="size-3.5" />
            Payment confirmed
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight text-balance text-foreground sm:text-3xl">
            Payment successful
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-pretty text-muted-foreground">
            We appreciate your business! A confirmation email will be sent to{' '}
            <span className="font-semibold text-foreground">
              {customer_details?.email ?? 'your email'}
            </span>
            .
          </p>
        </div>

        <div className={cn(cardClass, 'mt-8 overflow-hidden')}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Receipt className="size-4 shrink-0 text-brand-orange" />
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Transaction details
            </h2>
          </div>

          <dl className="divide-y divide-border">
            <InfoRow
              icon={Hash}
              label="Transaction ID"
              value={transactionId}
              mono
            />
            <InfoRow
              icon={CreditCard}
              label="Amount paid"
              value={amountTotal}
            />
            <InfoRow
              icon={BadgeCheck}
              label="Payment status"
              value={payment_status}
            />
            <InfoRow
              icon={Mail}
              label="Receipt email"
              value={customer_details?.email}
            />
            <InfoRow icon={Receipt} label="Checkout session" value={session.id} mono />
          </dl>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Keep your transaction ID handy — you&apos;ll need it for any payment
          enquiry.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Go to dashboard
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/browse-menu" />}
          >
            Browse the menu
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="max-w-lg">
      <div
        className={cn(
          cardClass,
          'flex flex-col items-center gap-3 p-8 text-center'
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-amber/15 text-brand-amber">
          <XCircle className="size-7" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment not completed
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Stripe hasn&apos;t confirmed this payment yet. If you were charged, it
          can take a moment to appear — otherwise you can try again.
        </p>

        <Button
          className="mt-2"
          nativeButton={false}
          render={<Link href="/checkout" />}
        >
          Back to checkout
        </Button>
      </div>
    </PageContainer>
  )
}

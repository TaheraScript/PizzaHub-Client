import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Pizza } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { MenuCard } from "@/components/menu/menu-card"
import { MenuCardSkeleton } from "@/components/menu/menu-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { getMenu } from "@/lib/api/menu"

const FEATURED_LIMIT = 6

async function FeaturedGrid() {
  let items
  try {
    // Only approved items are public (§7/§13).
    items = await getMenu("status=approved")
  } catch {
    return (
      <ErrorState
        title="Couldn't load featured pizzas"
        description="We couldn't reach the menu right now. Please try again in a moment."
      />
    )
  }

  const featured = items.slice(0, FEATURED_LIMIT)

  if (featured.length === 0) {
    return (
      <EmptyState
        icon={Pizza}
        title="No featured items yet"
        description="Fresh pizzas will show up here as soon as vendors publish them."
      />
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((item) => (
        <MenuCard key={item._id} item={item} />
      ))}
    </div>
  )
}

function FeaturedSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: FEATURED_LIMIT }).map((_, index) => (
        <MenuCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function FeaturedItems() {
  return (
    <section>
      <PageContainer>
        <SectionHeading
          eyebrow="Featured"
          title="Featured menu items"
          description="Hand-picked pizzas, sides and drinks from local vendors — ready to order right now."
          action={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/browse-menu" />}
            >
              View full menu
              <ArrowRight />
            </Button>
          }
        />

        <div className="mt-8">
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedGrid />
          </Suspense>
        </div>
      </PageContainer>
    </section>
  )
}

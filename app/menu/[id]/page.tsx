import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, MapPin, Store, Tag, XCircle, type LucideIcon } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { MenuGallery } from "@/components/menu/menu-gallery"
import { OrderButton } from "@/components/menu/order-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { getMenuItem } from "@/lib/api/menu"
import { requireSession } from "@/lib/core/server"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

type MenuItemPageProps = {
  params: Promise<{ id: string }>
}

function toImages(item: MenuItem): string[] {
  if (item.images?.length) return item.images
  if (typeof item.image === "string" && item.image.trim()) return [item.image]
  if (item.image && typeof item.image === "object" && item.image.url) {
    return [item.image.url]
  }
  return []
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <dt className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        {label}
      </dt>
      <dd className="truncate text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  )
}

export async function generateMetadata({
  params,
}: MenuItemPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const item = await getMenuItem(id)
    return { title: item.itemName, description: item.description }
  } catch {
    return { title: "Item details" }
  }
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  // Item details require a signed-in user (§4/§7).
  await requireSession()

  const { id } = await params

  let item: MenuItem | null = null
  try {
    item = await getMenuItem(id)
  } catch {
    item = null
  }

  // Invalid id, missing record, or not approved → appropriate error state.
  if (!item || item.status !== "approved") {
    return (
      <PageContainer>
        <EmptyState
          icon={XCircle}
          title="Item not available"
          description="This item doesn't exist, or it's no longer on the menu. It may have been removed, sold out, or is still awaiting approval."
          action={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/browse-menu" />}
            >
              <ArrowLeft />
              Back to menu
            </Button>
          }
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Button
        variant="ghost"
        nativeButton={false}
        render={<Link href="/browse-menu" />}
        className="-ml-2 mb-6"
      >
        <ArrowLeft />
        Back to menu
      </Button>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <MenuGallery images={toImages(item)} alt={item.itemName} />

        <div className="flex flex-col">
          <Badge size="md" className="self-start">
            <Tag className="size-3.5" />
            {item.category}
          </Badge>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            {item.itemName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              {item.location}
            </span>
            {item.vendorName ? (
              <span className="inline-flex items-center gap-1.5">
                <Store className="size-4 shrink-0" />
                {item.vendorName}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
            {item.description}
          </p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              ${Number(item.price).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">per item</span>
          </div>

          <div className="mt-6">
            <OrderButton menuItems={item} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Item details
        </h2>
        <dl className={cn(cardClass, "mt-4 divide-y divide-border")}>
          <DetailRow icon={Tag} label="Category" value={item.category} />
          <DetailRow icon={MapPin} label="Area" value={item.location} />
          <DetailRow
            icon={Store}
            label="Vendor"
            value={item.vendorName ?? "PizzaHub vendor"}
          />
        </dl>
      </section>
    </PageContainer>
  )
}

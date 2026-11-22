import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Store,
  Tag,
  XCircle,
  type LucideIcon,
} from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { MenuImage } from "@/components/menu/menu-image"
import { OrderButton } from "@/components/menu/order-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { getMenu, getMenuItem } from "@/lib/api/menu"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

type MenuDetailsPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: MenuDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const item = await getMenuItem(id)
    return { title: item.itemName, description: item.description }
  } catch {
    return { title: "Item details" }
  }
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

export default async function MenuDetailsPage({ params }: MenuDetailsPageProps) {
  const { id } = await params
  const item = await getMenu(id)
  const menuItem: MenuItem | null =
    item.find((candidate) => candidate._id === id) ?? null

  if (!menuItem || menuItem.status !== "approved") {
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

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
        <div className={cn(cardClass, "overflow-hidden")}>
          <div className="relative aspect-4/3 bg-muted">
            <MenuImage
              src={menuItem.image}
              alt={menuItem.itemName}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Badge size="md" className="self-start">
            <Tag className="size-3.5" />
            {menuItem.category}
          </Badge>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            {menuItem.itemName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              {menuItem.location}
            </span>
            {menuItem.vendorName ? (
              <span className="inline-flex items-center gap-1.5">
                <Store className="size-4 shrink-0" />
                {menuItem.vendorName}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
            {menuItem.description}
          </p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              ${Number(menuItem.price).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">per item</span>
          </div>

          <div className="mt-6">
            <OrderButton menuItems={menuItem} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Item details
        </h2>
        <dl className={cn(cardClass, "mt-4 divide-y divide-border")}>
          <DetailRow icon={Tag} label="Category" value={menuItem.category} />
          <DetailRow icon={MapPin} label="Area" value={menuItem.location} />
          <DetailRow
            icon={Store}
            label="Vendor"
            value={menuItem.vendorName ?? "PizzaHub vendor"}
          />
        </dl>
      </section>
    </PageContainer>
  )
}

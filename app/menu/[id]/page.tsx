import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Store } from "lucide-react"

import { MenuImage } from "@/components/menu/menu-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { getMenuItem } from "@/lib/api/menu"
import type { MenuItem } from "@/types"

type MenuItemPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: MenuItemPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const item = await getMenuItem(id)
    return { title: item.itemName, description: item.description }
  } catch {
    return { title: "Menu item" }
  }
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { id } = await params

  let item: MenuItem
  try {
    item = await getMenuItem(id)
  } catch {
    notFound()
  }

  if (item.status !== "approved") notFound()

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

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <MenuImage
            src={item.image}
            alt={item.itemName}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col">
          <Badge>{item.category}</Badge>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
            {item.itemName}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          <dl className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              <dt className="sr-only">Area</dt>
              <dd>{item.location}</dd>
            </div>
            {item.vendorName ? (
              <div className="flex items-center gap-2">
                <Store className="size-4 shrink-0" />
                <dt className="sr-only">Vendor</dt>
                <dd>{item.vendorName}</dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-8 text-3xl font-extrabold tracking-tight text-foreground">
            ${Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

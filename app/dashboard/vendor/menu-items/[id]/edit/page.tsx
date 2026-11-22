import { notFound } from "next/navigation"

import { EditMenuItemForm } from "./edit-form"
import { getMyMenuItems } from "@/lib/api/vendor"
import type { MenuItemImage } from "@/types/menu"

type EditMenuItemPageProps = {
  params: Promise<{ id: string }>
}

function toImageUrl(image: MenuItemImage | undefined): string | null {
  if (typeof image === "string") return image
  if (image && typeof image === "object" && image.url) return image.url
  return null
}

export default async function EditMenuItemPage({
  params,
}: EditMenuItemPageProps) {
  const { id } = await params

  let item
  try {
    const items = await getMyMenuItems()
    item = items.find((candidate) => candidate._id === id)
  } catch {
    item = undefined
  }

  if (!item) notFound()

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit menu item</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the details below. Availability and approval status are managed
          separately.
        </p>
      </header>

      <EditMenuItemForm
        itemId={item._id}
        defaultValues={{
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          price: String(item.price),
          location: item.location,
        }}
        currentImageUrl={toImageUrl(item.image)}
      />
    </div>
  )
}

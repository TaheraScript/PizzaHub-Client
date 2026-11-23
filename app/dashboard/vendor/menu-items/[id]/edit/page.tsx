import { notFound } from "next/navigation"

import { EditMenuItemForm } from "./edit-form"
import { getMyMenuItems } from "@/lib/api/vendor"
import type { MenuItem } from "@/types/menu"

type EditMenuItemPageProps = {
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
        currentImages={toImages(item)}
      />
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  MenuItemForm,
  type MenuItemFormValues,
} from "@/components/vendor/menu-item-form"
import { updateMenuItem } from "@/lib/actions/menu-items"

export function EditMenuItemForm({
  itemId,
  defaultValues,
  currentImages,
}: {
  itemId: string
  defaultValues: MenuItemFormValues
  currentImages: string[]
}) {
  const router = useRouter()

  return (
    <MenuItemForm
      defaultValues={defaultValues}
      currentImages={currentImages}
      submitLabel="Save changes"
      cancelHref="/dashboard/vendor/menu-items"
      onSubmit={async (values) => {
        await updateMenuItem(itemId, values)
        toast.success("Menu item updated.")
        router.push("/dashboard/vendor/menu-items")
      }}
    />
  )
}

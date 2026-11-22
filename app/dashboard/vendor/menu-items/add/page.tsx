"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { MenuItemForm } from "@/components/vendor/menu-item-form"
import { createMenu } from "@/lib/actions/menu-items"

export default function AddMenuItemPage() {
  const router = useRouter()

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add menu item</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New items are submitted as{" "}
          <span className="font-medium text-foreground">pending</span> until an
          admin approves them.
        </p>
      </header>

      <MenuItemForm
        imageRequired
        submitLabel="Add menu item"
        submittingLabel="Adding…"
        cancelHref="/dashboard/vendor/menu-items"
        onSubmit={async (values) => {
          await createMenu(values)
          toast.success("Menu item added and sent for review.")
          router.push("/dashboard/vendor/menu-items")
        }}
      />
    </div>
  )
}

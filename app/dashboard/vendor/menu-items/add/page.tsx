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
          const result = await createMenu(values)

          if (!result.ok) {
            // Free-plan item limit → prompt to upgrade instead of an error.
            if (/premium|3 active items/i.test(result.error)) {
              toast.error("Free plan limit reached", {
                description:
                  "The Free plan allows up to 3 active items. Upgrade to Premium for unlimited menu items.",
                action: {
                  label: "Upgrade",
                  onClick: () =>
                    router.push("/dashboard/vendor/subscription"),
                },
              })
            } else {
              toast.error(result.error)
            }
            return
          }

          toast.success("Menu item added and sent for review.")
          router.push("/dashboard/vendor/menu-items")
        }}
      />
    </div>
  )
}

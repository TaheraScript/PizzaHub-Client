"use client"

import Link from "next/link"
import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMenu } from "@/lib/actions/menu-items"
import { useRouter } from "next/navigation"

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
]

const EMPTY_FORM = {
  itemName: "",
  category: "",
  description: "",
  price: "",
  location: "",
}

export default function AddMenuItemPage() {
    const router =useRouter()
  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState<File | null>(null)

  const updateField = (field: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) =>
    setImage(event.target.files?.[0] ?? null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formElement = event.currentTarget // save it before any await

  const menuItem = {
    itemName: form.itemName.trim(),
    category: form.category,
    description: form.description.trim(),
    price: Number(form.price),
    location: form.location.trim(),
    image,
    status: "pending" as const,
  }

  try {
    const result = await createMenu(menuItem)
    console.log("New menu item:", result)
    toast.success("Menu item added and sent for review.")

    setForm(EMPTY_FORM)
    setImage(null)
    formElement.reset()
    router.push("/dashboard/vendor/menu-items")
  } catch (error) {
    toast.error("Could not add menu item")
    console.error(error)
  }
}
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

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="itemName">
            Item name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="itemName"
            name="itemName"
            placeholder="e.g. Pepperoni Feast"
            value={form.itemName}
            onChange={(event) => updateField("itemName", event.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm"
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">
              Price <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="Area or city"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the item, toppings and size."
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image">
            Item image <span className="text-destructive">*</span>
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            required
          />
          <p className="text-xs text-muted-foreground">
            PNG, JPG or WebP. Uploaded to ImgBB.
          </p>
        </div>

        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/vendor/menu-items" />}
          >
            Cancel
          </Button>
          <Button type="submit">Add menu item</Button>
        </div>
      </form>
    </div>
  )
}

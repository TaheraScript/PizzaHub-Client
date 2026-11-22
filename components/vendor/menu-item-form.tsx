"use client"

import Link from "next/link"
import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MENU_CATEGORIES } from "@/lib/constants/menu"
import { cn } from "@/lib/utils"

export type MenuItemFormValues = {
  itemName: string
  category: string
  description: string
  price: string
  location: string
}

type MenuItemFormProps = {
  defaultValues?: Partial<MenuItemFormValues>
  /** Existing image URL (edit mode) — kept when no new file is chosen. */
  currentImageUrl?: string | null
  imageRequired?: boolean
  submitLabel: string
  submittingLabel?: string
  cancelHref: string
  onSubmit: (values: {
    itemName: string
    category: string
    description: string
    price: number
    location: string
    image?: string
  }) => Promise<void>
}

export function MenuItemForm({
  defaultValues,
  currentImageUrl = null,
  imageRequired = false,
  submitLabel,
  submittingLabel = "Saving…",
  cancelHref,
  onSubmit,
}: MenuItemFormProps) {
  const [form, setForm] = useState<MenuItemFormValues>({
    itemName: defaultValues?.itemName ?? "",
    category: defaultValues?.category ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? "",
    location: defaultValues?.location ?? "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof MenuItemFormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) =>
    setImage(event.target.files?.[0] ?? null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (imageRequired && !image && !currentImageUrl) {
      toast.error("Please choose an item image.")
      return
    }

    setSubmitting(true)
    try {
      let imageUrl = currentImageUrl ?? undefined

      // Upload a newly-selected file to ImgBB via our server route (§17).
      if (image) {
        const body = new FormData()
        body.append("image", image)
        const res = await fetch("/api/upload", { method: "POST", body })
        const json = await res.json().catch(() => ({}))
        if (!res.ok || !json?.url) {
          throw new Error(json?.error ?? "Image upload failed")
        }
        imageUrl = json.url
      }

      await onSubmit({
        itemName: form.itemName.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        location: form.location.trim(),
        image: imageUrl,
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save the item"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(cardClass, "flex flex-col gap-5 p-6")}
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
          disabled={submitting}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            id="category"
            name="category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            disabled={submitting}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {MENU_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
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
            disabled={submitting}
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
          disabled={submitting}
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
          disabled={submitting}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image">
          Item image {imageRequired ? <span className="text-destructive">*</span> : null}
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          disabled={submitting}
          required={imageRequired && !currentImageUrl}
        />
        <p className="text-xs text-muted-foreground">
          {currentImageUrl
            ? "Leave empty to keep the current image. "
            : ""}
          PNG, JPG or WebP. Uploaded to ImgBB.
        </p>
      </div>

      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          render={<Link href={cancelHref} />}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}

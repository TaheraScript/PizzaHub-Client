"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { X } from "lucide-react"
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

export type MenuItemFormSubmit = {
  itemName: string
  category: string
  description: string
  price: number
  location: string
  /** Primary image (first of `images`), kept for card/list rendering. */
  image?: string
  /** All item images, in display order. */
  images?: string[]
}

type MenuItemFormProps = {
  defaultValues?: Partial<MenuItemFormValues>
  /** Existing image URLs (edit mode) — kept unless removed. */
  currentImages?: string[]
  imageRequired?: boolean
  submitLabel: string
  submittingLabel?: string
  cancelHref: string
  onSubmit: (values: MenuItemFormSubmit) => Promise<void>
}

type PickedImage = { file: File; preview: string }

export function MenuItemForm({
  defaultValues,
  currentImages = [],
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
  const [existing, setExisting] = useState<string[]>(currentImages)
  const [picked, setPicked] = useState<PickedImage[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Revoke object URLs when the form unmounts.
  const pickedRef = useRef(picked)
  pickedRef.current = picked
  useEffect(
    () => () => {
      pickedRef.current.forEach((image) => URL.revokeObjectURL(image.preview))
    },
    []
  )

  const updateField = (field: keyof MenuItemFormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    setPicked((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ])
    // Reset so the same file can be picked again later.
    event.target.value = ""
  }

  const removeExisting = (index: number) =>
    setExisting((prev) => prev.filter((_, i) => i !== index))

  const removePicked = (index: number) =>
    setPicked((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((_, i) => i !== index)
    })

  const thumbnails = [
    ...existing.map((url, index) => ({
      key: `existing-${index}-${url}`,
      src: url,
      onRemove: () => removeExisting(index),
    })),
    ...picked.map((image, index) => ({
      key: `picked-${index}-${image.preview}`,
      src: image.preview,
      onRemove: () => removePicked(index),
    })),
  ]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (imageRequired && existing.length + picked.length === 0) {
      toast.error("Please add at least one item image.")
      return
    }

    setSubmitting(true)
    try {
      // Upload every newly-picked file to ImgBB via our server route (§17).
      const uploaded: string[] = []
      for (const image of picked) {
        const body = new FormData()
        body.append("image", image.file)
        const res = await fetch("/api/upload", { method: "POST", body })
        const json = await res.json().catch(() => ({}))
        if (!res.ok || !json?.url) {
          throw new Error(json?.error ?? "Image upload failed")
        }
        uploaded.push(json.url)
      }

      const images = [...existing, ...uploaded]

      await onSubmit({
        itemName: form.itemName.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        location: form.location.trim(),
        image: images[0] ?? "",
        images,
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="images">
          Item images{" "}
          {imageRequired ? <span className="text-destructive">*</span> : null}
        </Label>

        {thumbnails.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {thumbnails.map((thumbnail, index) => (
              <div key={thumbnail.key} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail.src}
                  alt=""
                  className="size-20 rounded-xl border border-border object-cover"
                />
                {index === 0 ? (
                  <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                    Main
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={thumbnail.onRemove}
                  disabled={submitting}
                  aria-label="Remove image"
                  className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-destructive text-white shadow-sm transition-colors hover:bg-destructive/90 disabled:opacity-50"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <Input
          id="images"
          name="images"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleFiles}
          disabled={submitting}
        />
        <p className="text-xs text-muted-foreground">
          PNG, JPG or WebP. Add one or more — the first is the main image shown
          on cards. Uploaded to ImgBB.
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

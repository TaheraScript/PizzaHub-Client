"use client"

import { useState } from "react"

import { MenuImage } from "@/components/menu/menu-image"
import { cn } from "@/lib/utils"

type MenuGalleryProps = {
  images: string[]
  alt: string
}

/**
 * Item-details gallery. Shows a large image plus a thumbnail strip when the
 * item has more than one image; falls back to the pizza placeholder otherwise.
 */
export function MenuGallery({ images, alt }: MenuGalleryProps) {
  const [active, setActive] = useState(0)
  const hasMany = images.length > 1

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <MenuImage
          src={images[active]}
          alt={alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      {hasMany ? (
        <div className="flex flex-wrap gap-3">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-4/3 w-20 shrink-0 overflow-hidden rounded-xl border transition-colors",
                index === active
                  ? "border-brand-orange ring-2 ring-ring/40"
                  : "border-border hover:border-brand-orange/60"
              )}
            >
              <MenuImage src={src} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

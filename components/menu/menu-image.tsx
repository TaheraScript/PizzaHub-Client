"use client"

import Image, { type StaticImageData } from "next/image"
import { useState } from "react"

import fallbackImage from "@/app/images/hero-pizza.jpg"
import type { MenuItemImage } from "@/types/menu"

type MenuImageProps = {
  src?: MenuItemImage
  alt: string
  sizes?: string
  className?: string
}

function resolveImage(src: MenuItemImage | undefined): string | StaticImageData {
  if (typeof src === "string" && src.trim()) return src
  if (src && typeof src === "object" && src.url) return src.url
  return fallbackImage
}

export function MenuImage({ src, alt, sizes, className }: MenuImageProps) {
  const [failed, setFailed] = useState(false)
  const image = failed ? fallbackImage : resolveImage(src)

  return (
    <Image
      src={image}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      className={
        className ??
        "object-cover transition-transform duration-300 group-hover:scale-105"
      }
      onError={() => setFailed(true)}
    />
  )
}

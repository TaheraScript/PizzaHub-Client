import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export const cardClass = "rounded-2xl border border-border bg-card shadow-sm"

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card" className={cn(cardClass, className)} {...props} />
  )
}

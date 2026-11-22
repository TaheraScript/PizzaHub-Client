import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/** Active/inactive colour tokens shared by pill and tile filters. */
export function togglePillVariants(active: boolean) {
  return cn(
    "border transition-colors",
    active
      ? "border-brand-orange bg-brand-orange text-white shadow-sm"
      : "border-border bg-card text-muted-foreground hover:border-brand-orange/40 hover:text-foreground"
  )
}

type TogglePillProps = ComponentProps<"button"> & { active: boolean }

export function TogglePill({ active, className, ...props }: TogglePillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      data-slot="toggle-pill"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap",
        togglePillVariants(active),
        className
      )}
      {...props}
    />
  )
}

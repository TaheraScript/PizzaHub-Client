import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-2 rounded-full border font-semibold tracking-wide whitespace-nowrap",
  {
    variants: {
      variant: {
        brand: "border-brand-orange/30 bg-brand-orange/10 text-brand-orange",
        neutral: "border-border bg-card text-muted-foreground",
      },
      size: {
        sm: "px-3 py-1 text-xs",
        md: "px-3.5 py-1.5 text-xs sm:text-sm",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "sm",
    },
  }
)

export function Badge({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { badgeVariants }

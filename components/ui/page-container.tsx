import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function PageContainer({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-container"
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8",
        className
      )}
      {...props}
    />
  )
}

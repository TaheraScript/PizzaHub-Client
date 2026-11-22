import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/** Horizontally scrollable filter row that bleeds to the screen edge on mobile. */
export function ScrollRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="scroll-row"
      className={cn(
        "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0",
        className
      )}
      {...props}
    />
  )
}

import { Loader2 } from "lucide-react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type SpinnerProps = ComponentProps<typeof Loader2>

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2
      data-slot="spinner"
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

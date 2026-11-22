import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const STEPS = ["Account", "Plan", "Payment", "Review"] as const

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1
        const done = stepNumber < current
        const active = stepNumber === current

        return (
          <li key={step} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                  done
                    ? "bg-brand-green text-white"
                    : active
                      ? "bg-foreground text-background"
                      : "border border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="size-4" /> : stepNumber}
              </span>
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "hidden text-sm font-semibold sm:inline",
                  done
                    ? "text-brand-green"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>

            {index < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className="h-px w-4 shrink-0 bg-border sm:w-8"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

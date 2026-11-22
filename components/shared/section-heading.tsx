import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: "left" | "center"
  action?: ReactNode
  titleAs?: "h2" | "h3"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  titleAs: Title = "h2",
  className,
}: SectionHeadingProps) {
  const centered = align === "center"

  return (
    <div
      data-slot="section-heading"
      className={cn(
        "flex flex-col gap-4",
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("space-y-3", centered && "flex flex-col items-center")}>
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <Title className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
          {title}
        </Title>
        {description ? (
          <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

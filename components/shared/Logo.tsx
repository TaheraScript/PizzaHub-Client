import Image from "next/image"
import Link from "next/link"

import logo from "@/app/images/nav-logo.png"
import { cn } from "@/lib/utils"

type LogoProps = {
  /** Hide the "PizzaHub" wordmark and show only the emblem. */
  compact?: boolean
  className?: string
  /** Size of the emblem badge. */
  size?: "sm" | "md"
}

/**
 * Shared brand lockup: logo emblem + "PizzaHub" wordmark.
 * Used by the navbar and footer so the logo keeps one style/size everywhere.
 */
export function Logo({ compact = false, className, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="PizzaHub — home"
      className={cn(
        "group flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-primary/30 transition-transform duration-200 group-hover:scale-105",
          size === "md" ? "size-10 sm:size-11" : "size-8"
        )}
      >
        <Image
          src={logo}
          alt="PizzaHub logo"
          fill
          priority
          sizes={size === "md" ? "44px" : "32px"}
          className="object-contain p-0.5"
        />
      </span>

      {!compact && (
        <span
          className={cn(
            "font-extrabold tracking-tight text-foreground",
            size === "md" ? "text-xl sm:text-2xl" : "text-lg"
          )}
        >
          Pizza<span className="text-brand-orange">Hub</span>
        </span>
      )}
    </Link>
  )
}

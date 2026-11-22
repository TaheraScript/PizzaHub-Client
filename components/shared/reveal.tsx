"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  /** Stagger helper — seconds to wait before animating in. */
  delay?: number
  className?: string
}

/**
 * Subtle fade-up entrance used across the homepage sections. Animates once when
 * scrolled into view and is disabled when the user prefers reduced motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        ease: "easeOut",
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  )
}

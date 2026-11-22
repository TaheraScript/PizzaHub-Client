import Link from "next/link"
import {
  ArrowRight,
  ClipboardList,
  Search,
  Truck,
  type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Browse the menu",
    description:
      "Explore real menus from local vendors and filter by category, area or price.",
  },
  {
    icon: ClipboardList,
    title: "Place your order",
    description:
      "Pick a delivery date and address, add a special note, and confirm in seconds.",
  },
  {
    icon: Truck,
    title: "Track & enjoy",
    description:
      "Follow your order from the kitchen to your door and dig in while it's hot.",
  },
]

export function HowItWorks() {
  return (
    <section>
      <PageContainer>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="How PizzaHub works"
          description="Ordering hot, fresh pizza takes just three easy steps."
        />

        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="h-full">
              <Reveal
                delay={index * 0.08}
                className={cn(
                  cardClass,
                  "flex h-full flex-col gap-3 p-6 text-center sm:text-left"
                )}
              >
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-orange/10 text-brand-orange sm:mx-0">
                  <Icon className="size-6" />
                </span>
                <span className="text-xs font-bold tracking-wider text-brand-orange uppercase">
                  Step {index + 1}
                </span>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="h-11 rounded-full bg-brand-orange px-6 font-semibold text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href="/browse-menu" />}
          >
            Start your order
            <ArrowRight />
          </Button>
        </div>
      </PageContainer>
    </section>
  )
}

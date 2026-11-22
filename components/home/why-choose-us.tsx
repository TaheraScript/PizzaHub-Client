import { Bike, Flame, ShieldCheck, Store, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Flame,
    title: "Baked to order",
    description:
      "Every pizza is fired fresh in a local kitchen the moment you place your order.",
  },
  {
    icon: Bike,
    title: "Fast, tracked delivery",
    description:
      "Follow your order from the oven to your door and get it while it's still hot.",
  },
  {
    icon: Store,
    title: "Trusted local vendors",
    description:
      "Order from real neighborhood pizzerias you can rely on, not a faceless chain.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & simple",
    description:
      "Order in a few taps with a checkout you can trust and zero hidden surprises.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-secondary/40">
      <PageContainer>
        <SectionHeading
          align="center"
          eyebrow="Why PizzaHub"
          title="Why choose PizzaHub?"
          description="Fresh food, honest vendors and a delivery experience built around you."
        />

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="h-full">
              <Reveal
                delay={index * 0.06}
                className={cn(
                  cardClass,
                  "flex h-full flex-col items-center gap-3 p-6 text-center"
                )}
              >
                <span className="grid size-12 place-items-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <Icon className="size-6" />
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
        </ul>
      </PageContainer>
    </section>
  )
}

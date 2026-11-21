import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import pizza from "@/app/images/hero-pizza.jpg"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "500+", label: "Local pizza vendors" },
  { value: "30 min", label: "Average delivery" },
  { value: "4.9/5", label: "Customer rating" },
]

export function Banner() {
  return (
    <section className="bg-gradient-to-b from-secondary/60 to-background">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-orange sm:text-sm">
            <Sparkles className="size-3.5 sm:size-4" />
            Pizza ordering &amp; delivery platform
          </span>

          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza
            <span className="mt-1 block text-brand-orange">
              Ordered &amp; Delivered
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            PizzaHub connects customers with local pizza vendors. Browse real
            menus, order in seconds, and get it delivered hot to your door.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-brand-orange px-7 text-base font-bold text-white shadow-sm hover:bg-brand-orange/90 sm:w-auto"
              nativeButton={false}
              render={<Link href="/menu" />}
            >
              Explore Pizza Menu
              <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full px-7 text-base font-semibold sm:w-auto"
              nativeButton={false}
              render={<Link href="/sign-up" />}
            >
              Join as a vendor
            </Button>
          </div>

          <dl className="mt-10 grid w-full max-w-md grid-cols-3 gap-3 border-t border-border pt-6 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-xl font-extrabold text-foreground sm:text-2xl">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground sm:text-xs">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-border sm:rounded-[2.5rem] lg:aspect-square">
            <Image
              src={pizza}
              alt="Freshly baked pepperoni pizza with melted cheese"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

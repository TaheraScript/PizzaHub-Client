import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Bike,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
} from "lucide-react"

import pizza from "@/app/images/hero-pizza.jpg"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "500+", label: "Local pizza vendors" },
  { value: "30 min", label: "Average delivery" },
  { value: "4.9/5", label: "Customer rating" },
]

const features = [
  { icon: Bike, title: "Fast Delivery", description: "Hot at your door" },
  {
    icon: Store,
    title: "Local Vendors",
    description: "Fresh from nearby kitchens",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Safe checkout",
  },
]

export function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-hero text-hero-foreground">
      {/* Warm brand glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-15%] size-[26rem] rounded-full bg-brand-amber/20 blur-3xl sm:size-[34rem] lg:right-[-5%]" />
        <div className="absolute bottom-[-10rem] left-[-15%] size-[22rem] rounded-full bg-brand-red/20 blur-3xl sm:size-[30rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,166,35,0.16),transparent_55%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8 lg:pt-16 lg:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-amber/40 bg-brand-amber/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-amber sm:text-sm">
              <Sparkles className="size-3.5 sm:size-4" />
              Pizza ordering &amp; delivery platform
            </span>

            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              Hot &amp; Fresh Pizza
              <span className="mt-1 block bg-gradient-to-r from-brand-amber via-[#ffc247] to-brand-orange bg-clip-text text-transparent">
                Ordered &amp; Delivered
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-hero-foreground/75 sm:text-lg">
              PizzaHub connects customers with local pizza vendors. Browse real
              menus, order in seconds, and get it delivered hot to your door.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-12 w-full rounded-full px-7 text-base font-bold shadow-lg shadow-brand-amber/25 sm:w-auto"
                render={<Link href="/menu" />}
              >
                Explore Pizza Menu
                <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-white/25 bg-white/5 px-7 text-base font-semibold text-hero-foreground hover:bg-white/10 hover:text-hero-foreground sm:w-auto"
                render={<Link href="/sign-up" />}
              >
                Join as a vendor
              </Button>
            </div>

            <p className="mt-6 text-xs font-medium tracking-wide text-hero-foreground/60 sm:text-sm">
              For customers · vendors · admins
            </p>

            <dl className="mt-8 grid w-full max-w-md grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-xl font-extrabold text-hero-foreground sm:text-2xl">
                      {stat.value}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-tight text-hero-foreground/60 sm:text-xs">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Pizza visual */}
          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 translate-y-4 scale-95 rounded-[2.5rem] bg-brand-amber/25 blur-2xl"
            />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/10 sm:rounded-[2.5rem] lg:aspect-square">
              <Image
                src={pizza}
                alt="Freshly baked pepperoni pizza with melted cheese"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hero/60 via-transparent to-transparent" />

              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-hero/80 px-3 py-1.5 text-xs font-bold text-hero-foreground ring-1 ring-white/15 backdrop-blur sm:top-4 sm:right-4 sm:text-sm">
                <Star className="size-3.5 fill-brand-amber text-brand-amber sm:size-4" />
                4.9
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-2.5 rounded-2xl bg-hero/85 px-3 py-2.5 ring-1 ring-white/15 backdrop-blur sm:bottom-4 sm:left-4 sm:px-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-amber text-hero">
                  <Bike className="size-4.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-bold sm:text-sm">Free delivery</p>
                  <p className="text-[11px] text-hero-foreground/65">
                    on orders over $30
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <ul className="mt-12 grid gap-2 rounded-3xl border border-white/10 bg-white/5 p-3 sm:mt-16 sm:grid-cols-3 sm:p-4">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:justify-center"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-amber/15 text-brand-amber">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-hero-foreground/60">
                  {description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Curved transition into the page background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-10 sm:h-16"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-full w-full fill-background"
        >
          <path d="M0,64 C240,8 480,0 720,24 C960,48 1200,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  )
}

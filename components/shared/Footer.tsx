import Link from "next/link"
import { Clock, Heart, Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/shared/Logo"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/shared/social-icons"
import { PageContainer } from "@/components/ui/page-container"

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse-menu", label: "Browse Menu" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
]

const VENDOR_LINKS = [
  { href: "/sign-up", label: "Join as a vendor" },
  { href: "/dashboard/vendor", label: "Vendor dashboard" },
]

const CONTACT = [
  {
    icon: Mail,
    label: "taherascript@gmail.com",
    href: "mailto:taherascript@gmail.com",
  },
  { icon: Phone, label: "+8801310266587", href: "tel:+8801310266587" },
  { icon: MapPin, label: "Dhaka, Bangladesh", href: null },
  { icon: Clock, label: "Daily · 11:00 AM – 11:00 PM", href: null },
]

const SOCIALS = [
  { href: "https://x.com", label: "X (formerly Twitter)", Icon: XIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
]

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-4 w-1 rounded-full bg-gradient-to-b from-brand-amber to-brand-orange" />
      <h2 className="text-xs font-bold tracking-[0.15em] text-foreground uppercase">
        {children}
      </h2>
    </div>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-block text-sm text-muted-foreground transition-all duration-200 hover:translate-x-1 hover:text-brand-orange"
    >
      {label}
    </Link>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-gradient-to-b from-background to-secondary/50">
      {/* Top accent bar + soft brand glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-amber via-brand-orange to-brand-red"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 size-64 rounded-full bg-brand-orange/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-0 size-64 rounded-full bg-brand-amber/10 blur-3xl"
      />

      <PageContainer className="relative py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + socials */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              PizzaHub connects pizza lovers with local vendors. Browse real
              menus, order in seconds, and get it delivered hot to your door.
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange hover:bg-brand-orange hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer navigation" className="space-y-5 lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* For vendors */}
          <nav aria-label="Vendor links" className="space-y-5 lg:col-span-2">
            <FooterHeading>For vendors</FooterHeading>
            <ul className="space-y-3">
              {VENDOR_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <FooterHeading>Get in touch</FooterHeading>
            <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {CONTACT.map(({ icon: Icon, label, href }) => {
                const content = (
                  <>
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-orange/10 text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 text-sm break-words text-muted-foreground transition-colors group-hover:text-foreground">
                      {label}
                    </span>
                  </>
                )
                const baseClass =
                  "group flex items-center gap-3 rounded-xl border border-border bg-card/60 px-3 py-2 transition-colors"

                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className={`${baseClass} hover:border-brand-orange/50`}
                      >
                        {content}
                      </a>
                    ) : (
                      <div className={baseClass}>{content}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} PizzaHub. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with
            <Heart className="size-3.5 fill-brand-red text-brand-red" />
            for pizza lovers
          </p>
        </div>
      </PageContainer>
    </footer>
  )
}

import Link from "next/link"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/shared/Logo"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/shared/social-icons"
import { PageContainer } from "@/components/ui/page-container"
import { Separator } from "@/components/ui/separator"

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
  { icon: Mail, label: "hello@pizzahub.example", href: "mailto:hello@pizzahub.example" },
  { icon: Phone, label: "+1 (555) 010-2030", href: "tel:+15550102030" },
  { icon: MapPin, label: "240 Crust Avenue, Doughville", href: null },
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
    <h2 className="text-sm font-bold tracking-wide text-foreground uppercase">
      {children}
    </h2>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <PageContainer className="py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              PizzaHub connects pizza lovers with local vendors. Browse real
              menus, order in seconds, and get it delivered hot to your door.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-brand-orange hover:text-brand-orange focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer navigation" className="space-y-4">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For vendors */}
          <nav aria-label="Vendor links" className="space-y-4">
            <FooterHeading>For vendors</FooterHeading>
            <ul className="space-y-2.5">
              {VENDOR_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-4">
            <FooterHeading>Contact</FooterHeading>
            <ul className="space-y-3">
              {CONTACT.map(({ icon: Icon, label, href }) => (
                <li
                  key={label}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-brand-orange" />
                  {href ? (
                    <a
                      href={href}
                      className="transition-colors hover:text-brand-orange"
                    >
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} PizzaHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made fresh, delivered fast.
          </p>
        </div>
      </PageContainer>
    </footer>
  )
}

import Link from "next/link"

import { getCategoryIcon } from "@/components/menu/category-icon"
import { SectionHeading } from "@/components/shared/section-heading"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { MENU_CATEGORIES } from "@/lib/constants/menu"
import { cn } from "@/lib/utils"

export function CategoriesSection() {
  return (
    <section>
      <PageContainer>
        <SectionHeading
          align="center"
          eyebrow="Categories"
          title="Browse by category"
          description="From classic margheritas to sides and desserts — find exactly what you're craving."
        />

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {MENU_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category)

            return (
              <li key={category}>
                <Link
                  href={`/browse-menu?category=${encodeURIComponent(category)}`}
                  className={cn(
                    cardClass,
                    "group flex h-full flex-col items-center gap-3 p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-md focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                  )}
                >
                  <span className="grid size-12 place-items-center rounded-full bg-brand-orange/10 text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-semibold text-balance text-foreground">
                    {category}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </PageContainer>
    </section>
  )
}

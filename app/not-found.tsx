import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <PageContainer className="max-w-lg">
      <div
        className={cn(
          cardClass,
          "flex flex-col items-center gap-3 p-8 text-center"
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-7" />
        </span>
        <p className="text-sm font-bold tracking-widest text-brand-orange">404</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button nativeButton={false} render={<Link href="/" />}>
            Back home
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/browse-menu" />}
          >
            Browse menu
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

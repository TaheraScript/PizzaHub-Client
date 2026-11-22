"use client"

import { useEffect } from "react"
import { ServerCrash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageContainer className="max-w-lg">
      <div
        className={cn(
          cardClass,
          "flex flex-col items-center gap-3 p-8 text-center"
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ServerCrash className="size-7" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <Button className="mt-2" onClick={reset}>
          Try again
        </Button>
      </div>
    </PageContainer>
  )
}

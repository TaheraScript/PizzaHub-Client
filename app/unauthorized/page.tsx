import type { Metadata } from "next"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Access denied",
}

export default function UnauthorizedPage() {
  return (
    <PageContainer className="max-w-lg">
      <div
        className={cn(
          cardClass,
          "flex flex-col items-center gap-3 p-8 text-center"
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Access denied
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          You don&apos;t have permission to view this page. If you think this is
          a mistake, sign in with the right account or head back home.
        </p>

        <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to home
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            Sign in
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

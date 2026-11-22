import { MenuCardSkeleton } from "@/components/menu/menu-card-skeleton"
import { PageContainer } from "@/components/ui/page-container"
import { Skeleton } from "@/components/ui/skeleton"

export default function BrowseMenuLoading() {
  return (
    <PageContainer>
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="mt-4 h-10 w-72 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 w-full rounded-full sm:w-44" />
      </div>

      <div className="mt-4 flex gap-2.5 overflow-hidden">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-[4.75rem] w-24 shrink-0 rounded-xl" />
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-28 shrink-0 rounded-full" />
        ))}
      </div>

      <Skeleton className="mt-8 h-4 w-28" />

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <MenuCardSkeleton key={index} />
        ))}
      </div>
    </PageContainer>
  )
}

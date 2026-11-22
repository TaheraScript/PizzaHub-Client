import { Skeleton } from "@/components/ui/skeleton"
import { cardClass } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function OrderCardSkeleton() {
  return (
    <div
      className={cn(cardClass, "flex flex-col gap-4 p-4 sm:flex-row sm:gap-5")}
    >
      <Skeleton className="h-40 w-full shrink-0 rounded-xl sm:h-28 sm:w-28" />
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export default function CustomerOrdersLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

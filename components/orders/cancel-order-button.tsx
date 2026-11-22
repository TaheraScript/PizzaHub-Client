"use client"

import { X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function CancelOrderButton({ orderId }: { orderId: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 rounded-full px-4 font-semibold"
      aria-label={`Cancel order ${orderId}`}
      onClick={() => toast.info("Cancelling orders is coming soon")}
    >
      <X />
      Cancel order
    </Button>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cancelOrder } from "@/lib/actions/order"

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleCancel = async () => {
    if (pending) return
    setPending(true)
    try {
      await cancelOrder(orderId)
      toast.success("Order cancelled")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not cancel the order"
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 rounded-full px-4 font-semibold"
      aria-label={`Cancel order ${orderId}`}
      onClick={handleCancel}
      disabled={pending}
    >
      <X />
      {pending ? "Cancelling…" : "Cancel order"}
    </Button>
  )
}

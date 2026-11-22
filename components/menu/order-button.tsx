"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { CreateOrderInput, MenuItem } from "@/types"
import { useRouter } from "next/navigation"
import { orderMenu } from "@/lib/actions/order"

const SIZE_CLASS =
  "h-12 w-full rounded-full text-base font-bold sm:w-auto sm:px-8"

const PRIMARY_CLASS =
  "bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90"

export function OrderButton({ menuItems }: { menuItems: MenuItem }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const user = session?.user

  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [message, setMessage] = useState("")

  const handleOrderNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-menu/${menuItems._id}`)
      return
    }

    if (user.role !== "customer") {
      toast.error("Only customers can place orders")
      return
    }

    if (!deliveryDate || !deliveryAddress.trim()) {
      toast.error("Add a delivery date and address to place your order")
      return
    }

    const order: CreateOrderInput = {
      itemId: menuItems._id,
      customerId: user.id,
      customerName: user.name ?? undefined,
      customerEmail: user.email,
      deliveryDate,
      deliveryAddress: deliveryAddress.trim(),
      message: message.trim() || undefined,
    }

    try {
      const result = await orderMenu(order)
      if (result.insertedId) {
        toast.success("Order placed successfully")
        router.push("/dashboard/customer/orders")
      } else {
        toast.error("Could not place your order. Please try again.")
      }
    } catch (error) {
      toast.error("Could not place your order", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  const role = session?.user?.role

 

  if (isPending) {
    return (
      <div
        className={cn(SIZE_CLASS, "animate-pulse bg-muted")}
        aria-hidden="true"
      />
    )
  }

  if (!session) {
    return (
      <Button
        size="lg"
        variant="outline"
        className={SIZE_CLASS}
        nativeButton={false}
        render={<Link href="/sign-in" />}
      >
        <ShoppingBag />
        Sign in to order
      </Button>
    )
  }

  if (role === "admin" || role === "vendor") {
    const message =
      role === "admin"
        ? "Admins can't place customer orders"
        : "You can't order your own items"

    return (
      <Button
        size="lg"
        variant="secondary"
        className={SIZE_CLASS}
        disabled
        title={message}
      >
        <ShoppingBag />
        {message}
      </Button>
    )
  }

  return (
    <div className={cn(cardClass, "flex flex-col gap-4 p-4 sm:p-5")}>
      <h2 className="text-sm font-bold tracking-tight text-foreground">
        Delivery details
      </h2>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deliveryDate">Delivery date</Label>
        <Input
          id="deliveryDate"
          type="date"
          value={deliveryDate}
          onChange={(event) => setDeliveryDate(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deliveryAddress">Delivery address</Label>
        <Input
          id="deliveryAddress"
          placeholder="House, street, area"
          value={deliveryAddress}
          onChange={(event) => setDeliveryAddress(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">
          Message <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="message"
          rows={3}
          placeholder="Special instructions for the vendor"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <Button
        size="lg"
        className={cn(
          "h-12 w-full rounded-full text-base font-bold",
          PRIMARY_CLASS
        )}
        onClick={handleOrderNow}
      >
        <ShoppingBag />
        Order now
      </Button>
    </div>
  )
}

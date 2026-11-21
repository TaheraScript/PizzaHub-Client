"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteMenu } from "@/lib/actions/menu-items"

type DeleteMenuDialogProps = {
  item: { _id: string; itemName: string }
  onDeleted?: (id: string) => void
}

export function DeleteMenuDialog({ item, onDeleted }: DeleteMenuDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDeleteMenu = async () => {
    if (deleting) return

    setDeleting(true)
    try {
      await deleteMenu(item._id)
      toast.success("Menu item deleted", {
        description: `${item.itemName} has been removed from your menu.`,
      })
      onDeleted?.(item._id)
      router.refresh()
    } catch (error) {
      toast.error("Could not delete menu item", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setDeleting(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!deleting) setOpen(nextOpen)
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${item.itemName}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{item.itemName}</strong> from
            your menu. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={handleDeleteMenu}
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

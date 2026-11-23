"use client"

import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cardClass } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U"
}

export function ProfileForm({
  name,
  email,
  image,
  role,
  businessName,
}: {
  name: string
  email: string
  image: string | null
  role: string
  businessName: string
}) {
  const [formName, setFormName] = useState(name)
  const [formBusinessName, setFormBusinessName] = useState(businessName)
  const [imageUrl, setImageUrl] = useState<string | null>(image)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const body = new FormData()
      body.append("image", file)
      const res = await fetch("/api/upload", { method: "POST", body })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.url) {
        throw new Error(json?.error ?? "Image upload failed")
      }
      setImageUrl(json.url)
      toast.success("Image uploaded")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      // Only name + image (+ restaurant name for vendors) are sent —
      // role/subscription are server-managed (§11).
      const { error } = await authClient.updateUser({
        name: formName.trim(),
        image: imageUrl ?? undefined,
        ...(role === "vendor" ? { businessName: formBusinessName.trim() } : {}),
      })
      if (error) {
        throw new Error(error.message ?? "Could not update profile")
      }
      toast.success("Profile updated")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update profile"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(cardClass, "flex flex-col gap-5 p-6")}
    >
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          {imageUrl ? <AvatarImage src={imageUrl} alt={formName || "Profile"} /> : null}
          <AvatarFallback>{initials(formName)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <Label htmlFor="image">Profile image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading || saving}
          />
          {uploading ? (
            <p className="text-xs text-muted-foreground">Uploading…</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={formName}
          onChange={(event) => setFormName(event.target.value)}
          disabled={saving}
          required
        />
      </div>

      {role === "vendor" ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="businessName">Restaurant name</Label>
          <Input
            id="businessName"
            value={formBusinessName}
            onChange={(event) => setFormBusinessName(event.target.value)}
            placeholder="e.g. Slice House"
            disabled={saving}
          />
          <p className="text-xs text-muted-foreground">
            Shown on your menu items as the vendor name.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Email, role and subscription can&apos;t be changed here.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

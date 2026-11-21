"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { ChangeEvent } from "react"
import { toast } from "sonner"

import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

/** Admin accounts cannot be created via public registration. */
type Role = "customer" | "vendor"

type SignUpForm = {
  name: string
  email: string
  password: string
  image: File | null
  role: Role
}

const ROLES: { value: Role; label: string; description: string }[] = [
  {
    value: "customer",
    label: "Customer",
    description: "Browse menus and order pizza",
  },
  {
    value: "vendor",
    label: "Vendor",
    description: "Sell your pizza on PizzaHub",
  },
]

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    image: null,
    role: "customer",
  })

  const updateField = <K extends keyof SignUpForm>(field: K, value: SignUpForm[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) =>
    updateField("image", event.target.files?.[0] ?? null)

  const router = useRouter()

  const handleSubmit = async (data: SignUpForm) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      callbackURL: "/",
    })

    if (error) {
      toast.error(error.message ?? "Could not create your account. Please try again.")
      return
    }

    toast.success("Account created! Welcome to PizzaHub.")
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo compact />
          <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join PizzaHub and get hot &amp; fresh pizza delivered to your door.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit(form)
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Jane Doe"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              At least 6 characters, including 1 uppercase and 1 lowercase letter.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image">
              Profile image <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Account role</legend>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => {
                const checked = form.role === role.value
                return (
                  <label
                    key={role.value}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3 transition-colors",
                      checked
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={checked}
                      onChange={() => updateField("role", role.value)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold">{role.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {role.description}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <Button type="submit" className="mt-1 h-11 w-full font-semibold">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-brand-orange hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { FormEvent } from "react"
import { toast } from "sonner"

import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

type SignInForm = {
  email: string
  password: string
}

export default function SignInPage() {
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  })

  const updateField = (field: keyof SignInForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
      rememberMe: true,
      callbackURL: "/",
    })

    if (error) {
      toast.error(error.message ?? "Invalid email or password.")
      return
    }

    toast.success("Signed in successfully!")
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo compact />
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to track orders and manage your pizza.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
            />
          </div>

          <Button type="submit" className="mt-1 h-11 w-full font-semibold">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-brand-orange hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

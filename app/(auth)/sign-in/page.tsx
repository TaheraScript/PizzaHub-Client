"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import type { FormEvent } from "react"
import { toast } from "sonner"

import logo from "@/app/images/nav-logo.png"
import pizza from "@/app/images/hero-pizza.jpg"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

type SignInForm = {
  email: string
  password: string
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

function SignInForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? "/"
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof SignInForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)
    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        rememberMe: true,
      })

      if (error) {
        toast.error(error.message ?? "Invalid email or password.")
        return
      }

      toast.success("Signed in successfully!")
      const role = data?.user?.role ?? "customer"
      const destination =
        redirectTo && redirectTo !== "/" ? redirectTo : `/dashboard/${role}`
      router.push(destination)
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: redirectTo })
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4 sm:p-6">
      <div className="grid w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-xl sm:max-w-lg lg:max-w-5xl lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden bg-brand-orange text-white lg:flex lg:flex-col">
          <div className="p-8">
            <div className="flex items-center gap-2.5">
              <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-white">
                <Image
                  src={logo}
                  alt="PizzaHub logo"
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                />
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Pizza<span className="text-white/80">Hub</span>
              </span>
            </div>

            <p className="mt-10 max-w-[15rem] text-balance text-2xl leading-snug font-medium">
              Order your favorite pizza and let{" "}
              <span className="font-extrabold">PizzaHub</span> deliver it hot to
              your door.
            </p>
          </div>

          <div className="relative mt-6 min-h-44 flex-1" aria-hidden="true">
            <Image
              src={pizza}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-t from-transparent to-brand-orange/70" />
          </div>
        </div>

        {/* Form panel */}
        <div className="p-6 sm:p-8 lg:p-10">
          <Logo className="mb-6 lg:hidden" />

          <h1 className="text-2xl leading-snug font-bold tracking-tight text-foreground">
            Welcome back. Sign in to{" "}
            <span className="text-brand-orange">order your favorites.</span>
          </h1>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-1 h-11 w-full bg-brand-orange font-semibold tracking-wide text-white uppercase hover:bg-brand-orange/90"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-medium"
              onClick={handleGoogle}
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-brand-orange hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignInFallback() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4 sm:p-6">
      <div className="h-[30rem] w-full max-w-md animate-pulse rounded-3xl border border-border bg-card shadow-xl sm:max-w-lg lg:max-w-5xl" />
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </Suspense>
  )
}

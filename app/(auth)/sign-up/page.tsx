"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { ChangeEvent } from "react"
import { toast } from "sonner"

import logo from "@/app/images/nav-logo.png"
import pizza from "@/app/images/hero-pizza.jpg"
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
  confirmPassword: string
  image: File | null
  role: Role
  businessName: string
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

function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters."
  if (!/[A-Z]/.test(password))
    return "Password must include at least 1 uppercase letter."
  if (!/[a-z]/.test(password))
    return "Password must include at least 1 lowercase letter."
  return null
}

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
    role: "customer",
    businessName: "",
  })
  const [agreed, setAgreed] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const updateField = <K extends keyof SignUpForm>(field: K, value: SignUpForm[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    updateField("image", file)

    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(file ? URL.createObjectURL(file) : null)
    setImageUrl(null)

    if (!file) return

    setUploadingImage(true)
    try {
      const body = new FormData()
      body.append("image", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      })
      const result = await res.json()

      if (!res.ok || !result?.url) {
        throw new Error(result?.error ?? "Image upload failed.")
      }

      setImageUrl(result.url)
      toast.success("Profile image uploaded.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not upload the image."
      )
    } finally {
      setUploadingImage(false)
    }
  }

  const router = useRouter()

  const handleSubmit = async (data: SignUpForm) => {
    if (!agreed) {
      toast.error("Please accept the Terms of Service to continue.")
      return
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    const passwordError = validatePassword(data.password)
    if (passwordError) {
      toast.error(passwordError)
      return
    }
    if (data.role === "vendor" && !data.businessName.trim()) {
      toast.error("Please add your restaurant name.")
      return
    }
    if (uploadingImage) {
      toast.info("Hang on — your profile image is still uploading.")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        businessName:
          data.role === "vendor" ? data.businessName.trim() : undefined,
        image: imageUrl ?? undefined,
        callbackURL: "/",
      })

      if (error) {
        toast.error(
          error.message ?? "Could not create your account. Please try again."
        )
        return
      }

      toast.success("Account created! Welcome to PizzaHub.")
      router.push(
        data.role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"
      )
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" })
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
            Let&apos;s create your account and get{" "}
            <span className="text-brand-orange">fresh pizza delivered fast.</span>
          </h1>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSubmit(form)
            }}
            className="mt-7 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs text-muted-foreground">
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>

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
                autoComplete="new-password"
                minLength={6}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                At least 6 characters, including 1 uppercase and 1 lowercase letter.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="image" className="text-xs text-muted-foreground">
                Profile image (optional)
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                disabled={submitting}
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="mt-1 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl ?? imagePreview}
                    alt="Profile preview"
                    className="size-14 rounded-full border border-border object-cover"
                  />
                  <span className="text-xs text-muted-foreground">
                    {uploadingImage
                      ? "Uploading image…"
                      : imageUrl
                        ? "Image uploaded"
                        : "Preview only"}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Account role</span>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => {
                  const checked = form.role === role.value
                  return (
                    <label
                      key={role.value}
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 transition-colors",
                        checked
                          ? "border-brand-orange bg-brand-orange/10"
                          : "border-input hover:bg-muted"
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
                      <span className="block text-sm font-semibold">
                        {role.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {form.role === "vendor" ? (
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="businessName"
                  className="text-xs text-muted-foreground"
                >
                  Restaurant name
                </Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="e.g. Slice House"
                  value={form.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  disabled={submitting}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Shown on your menu items as the vendor name.
                </p>
              </div>
            ) : null}

            <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-input accent-brand-orange"
              />
              <span>
                I have read the{" "}
                <Link href="#" className="font-medium text-brand-orange hover:underline">
                  Privacy Policy
                </Link>{" "}
                and agree to the{" "}
                <Link href="#" className="font-medium text-brand-orange hover:underline">
                  Terms of Service
                </Link>
                .
              </span>
            </label>

            <Button
              type="submit"
              disabled={submitting || uploadingImage}
              className="h-11 w-full bg-brand-orange font-semibold tracking-wide text-white uppercase hover:bg-brand-orange/90"
            >
              {submitting ? "Creating account…" : "Sign up"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-medium"
              onClick={handleGoogle}
            >
              <GoogleIcon />
              Sign up with Google
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-brand-orange hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

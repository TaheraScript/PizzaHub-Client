"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { BriefcaseBusiness, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export type AuthMode = "sign-in" | "sign-up"

export type UserRole = "customer" | "vendor" | "admin"


const roles: { value: UserRole; label: string; icon: LucideIcon }[] = [
  { value: "customer", label: "Customer", icon: UserRound },
  { value: "vendor", label: "Nendor", icon: BriefcaseBusiness },
]

const copy = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to continue finding your next opportunity.",
    submit: "Sign In",
    switchText: "Don't have an account?",
    switchLabel: "Sign up",
    switchHref: "/sign-up",
  },
  "sign-up": {
    title: "Create your account",
    subtitle: "Join HireLoop and start discovering curated jobs.",
    submit: "Create Account",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/sign-in",
  },
} satisfies Record<AuthMode, Record<string, string>>

const inputClassName =
  "h-11 rounded-lg border-[#2b2b30] bg-[#0b0b0d] px-3 text-[15px] text-white placeholder:text-[#6f6f78] focus-visible:border-[#5b4bf5] focus-visible:ring-[#5b4bf5]/20"
export type AuthFormData={
   email: string,
    password:string,
    name?: string,
    role?: UserRole,
    image?: string,
}
export function AuthForm({ mode, onSubmit,}: {
  mode: AuthMode
  // Return an error message string on failure, or nothing on success.
  onSubmit?: (data: AuthFormData) => Promise<string | void>
}) {
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<string | null>(null)
  const content = copy[mode]
  const [values, setValues] = React.useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    role: 'customer',
    image: undefined,
  })
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (imageFile) URL.revokeObjectURL(imageFile)
    setImageFile(file? URL.createObjectURL(file): null)

    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    const imgbbAPI = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`

    const res = await fetch(imgbbAPI, {
      method: "POST",
      body: formData,
    })
    const result = await res.json()
    const imageURL =result.data.url
    console.log(result)
    setValues((prev)=>({...prev,image: imageURL}))
  }

  const  handleSubmit = async(data: AuthFormData)=> {
  
    setError(null)

    const {data: signUpResponse,error: signUpError}=await authClient.signUp.email({
      name: data.name as string,
      email: data.email,
      password:data.password,
      role: data.role,
      image: data.image,
    })

    if (signUpError || !signUpResponse) {
      setError(signUpError?.message ?? "Could not create your account.")
      return
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100svh-145px)] items-center justify-center overflow-hidden bg-[#08080a] px-4 py-16 sm:px-6 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_40%,rgba(91,75,245,0.12),transparent_70%)]"
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          aria-label="pizzahub home"
          className="mb-6 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="hireloop"
            width={154}
            height={44}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="rounded-2xl border border-[#26262c] bg-[#101012]/95 p-6 shadow-[0_30px_100px_-40px_rgba(91,75,245,0.45)] sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {content.title}
            </h1>
            <p className="mt-2 text-sm text-[#a1a1aa]">{content.subtitle}</p>
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              const data: AuthFormData = {
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                role: String(formData.get("role") ?? "seeker") as UserRole,
                image: values.image,
              }

              setLoading(true)
              try {
                if (mode === "sign-up") {
                  await handleSubmit(data)
                } else {
                  setError((await onSubmit?.(data)) || null)
                }
              } finally {
                setLoading(false)
              }
            }}
            className="space-y-4"
          >
            {mode === "sign-up" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#d4d4d8]">
                  Full name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  required
                  className={inputClassName}
                />
              </div>
            )}

            {mode === "sign-up" && (
              <div className="space-y-2">
                <Label htmlFor="image" className="text-[#d4d4d8]">
                  Profile photo
                </Label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full cursor-pointer rounded-lg border border-[#2b2b30] bg-[#0b0b0d] px-3 py-2 text-[13px] text-[#a1a1aa] file:mr-3 file:rounded-md file:border-0 file:bg-[#1c1c22] file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-[#d4d4d8] hover:file:bg-[#26262c]"
                />
                {imageFile && (
                  <img
                    src={values.image ?? imageFile}
                    alt="Profile preview"
                    className="size-16 rounded-full border border-[#2b2b30] object-cover"
                  />
                )}
              </div>
            )}

            {mode === "sign-up" && (
              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm leading-none font-medium text-[#d4d4d8]">
                  I am a
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {roles.map(({ value, label, icon: Icon }) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        defaultChecked={value === "customer"}
                        className="peer sr-only"
                      />
                      <span className="flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#2b2b30] bg-[#0b0b0d] px-2 text-[13px] font-medium whitespace-nowrap text-[#a1a1aa] transition-colors peer-checked:border-[#5b4bf5] peer-checked:bg-[#5b4bf5]/10 peer-checked:text-white peer-focus-visible:ring-3 peer-focus-visible:ring-[#5b4bf5]/20 hover:border-[#3a3a42] sm:text-sm">
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span>{label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#d4d4d8]">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#d4d4d8]">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                placeholder="••••••••"
                minLength={8}
                required
                className={inputClassName}
              />
            </div>

            {mode === "sign-up" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#d4d4d8]">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                  className={inputClassName}
                />
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-[#f87171]">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-[10px] bg-[#5b4bf5] text-[15px] font-medium text-white hover:bg-[#4f41e0] disabled:opacity-60"
            >
              {loading ? "Please wait..." : content.submit}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8a8a93]">
            {content.switchText}{" "}
            <Link
              href={content.switchHref}
              className="font-medium text-[#8b7cff] transition-colors hover:text-[#a89dff]"
            >
              {content.switchLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

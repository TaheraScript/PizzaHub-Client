import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const IMGBB_API_KEY = process.env.IMGBB_API_KEY

/**
 * Server-side ImgBB upload so the API key never reaches the browser (§17).
 * Requires a signed-in user.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!IMGBB_API_KEY) {
    return NextResponse.json(
      { error: "Image uploads are not configured" },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const file = formData.get("image")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 })
  }

  const imgbbForm = new FormData()
  imgbbForm.append("image", file)

  try {
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        headers: {
          // ImgBB's WAF rejects requests without a browser-like User-Agent.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
        body: imgbbForm,
      }
    )
    const data = await res.json()

    if (!res.ok || !data?.data?.url) {
      return NextResponse.json(
        { error: data?.error?.message ?? "Upload failed" },
        { status: 502 }
      )
    }

    return NextResponse.json({ url: data.data.url })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 502 })
  }
}

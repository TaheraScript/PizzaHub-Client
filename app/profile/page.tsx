import type { Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { PageContainer } from "@/components/ui/page-container"
import { requireSession } from "@/lib/core/server"

import { ProfileForm } from "./profile-form"

export const metadata: Metadata = {
  title: "Profile settings",
}

export default async function ProfilePage() {
  const session = await requireSession()

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader
        title="Profile settings"
        description="Update your name and profile photo."
      />
      <div className="mt-6">
        <ProfileForm
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          image={typeof session.user.image === "string" ? session.user.image : null}
        />
      </div>
    </PageContainer>
  )
}

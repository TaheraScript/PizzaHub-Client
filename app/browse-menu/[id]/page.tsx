import { redirect } from "next/navigation"

type BrowseMenuDetailsPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Legacy duplicate of the item-details page. Item Details is served from
 * `/menu/[id]` (§4/§7), so this route just redirects there.
 */
export default async function BrowseMenuDetailsPage({
  params,
}: BrowseMenuDetailsPageProps) {
  const { id } = await params
  redirect(`/menu/${id}`)
}

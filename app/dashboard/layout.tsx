import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { requireSession } from "@/lib/core/server"
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-16 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:px-6">
            <SidebarTrigger />
          </header>
          <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            {children}
            </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

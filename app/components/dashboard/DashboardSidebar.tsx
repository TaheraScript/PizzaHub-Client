"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CreditCard,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

import { Logo } from "@/components/shared/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Role = "customer" | "vendor" | "admin"

type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  customer: [
    {
      id: "customer-overview",
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      id: "customer-orders",
      name: "My Orders",
      url: "/dashboard/customer/orders",
      icon: ShoppingBag,
    },
    {
      id: "customer-profile",
      name: "Profile Settings",
      url: "/profile",
      icon: Settings,
    },
  ],
  vendor: [
    {
      id: "vendor-overview",
      name: "Overview",
      url: "/dashboard/vendor",
      icon: LayoutDashboard,
    },
    {
      id: "vendor-menu-items",
      name: "My Menu Items",
      url: "/dashboard/vendor/menu-items",
      icon: UtensilsCrossed,
    },
    {
      id: "vendor-add-menu-item",
      name: "Add Menu Item",
      url: "/dashboard/vendor/menu-items/add",
      icon: Plus,
    },
    {
      id: "vendor-orders",
      name: "Customer Orders",
      url: "/dashboard/vendor/orders",
      icon: ShoppingBag,
    },
    {
      id: "vendor-subscription",
      name: "Subscription",
      url: "/dashboard/vendor/subscription",
      icon: CreditCard,
    },
    {
      id: "vendor-profile",
      name: "Profile Settings",
      url: "/profile",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-menu-items",
      name: "Manage Menu Items",
      url: "/dashboard/admin/menu-items",
      icon: Store,
    },
    {
      id: "admin-transactions",
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
}

export function DashboardSidebar({
  role,
  name,
}: {
  role: Role
  name?: string | null
}) {
  const pathname = usePathname()

  const root = `/dashboard/${role}`
  const items = menuItemsByRole[role]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <Logo size="sm" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  item.url === root
                    ? pathname === item.url
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.name}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border px-2.5 py-2 text-xs">
          <span className="truncate font-medium text-sidebar-foreground">
            {name}
          </span>
          <span className="ml-auto shrink-0 rounded-full bg-sidebar-accent px-2 py-0.5 font-semibold text-sidebar-accent-foreground">
            {ROLE_LABEL[role]}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

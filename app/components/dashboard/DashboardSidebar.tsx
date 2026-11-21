"use client"

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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

type Role = "customer" | "vendor" | "admin"

type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
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

export function DashboardSidebar() {
  const { data: session } = useSession()
  const role = session?.user?.role || "customer"

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          {menuItemsByRole[role].map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton render={<a href={item.url} />}>
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

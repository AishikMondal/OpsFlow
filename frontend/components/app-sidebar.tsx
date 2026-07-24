'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileUp,
  Boxes,
  BarChart3,
  FileText,
  CheckSquare,
  Bell,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { notifications } from '@/lib/mock-data'

const mainNav = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Invoice Upload', href: '/invoices', icon: FileUp },
  { title: 'Inventory', href: '/inventory', icon: Boxes },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Reports', href: '/reports', icon: FileText },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare },
]

const systemNav = [
  { title: 'Notifications', href: '/notifications', icon: Bell },
  { title: 'AI Assistant', href: '/assistant', icon: Sparkles },
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">OpsFlow AI</span>
            <span className="text-xs text-muted-foreground">Business OS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.href === '/notifications' && unread > 0 && (
                    <SidebarMenuBadge className="bg-primary/15 text-primary">{unread}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-2.5 py-2">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/15 text-xs text-primary">AR</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-medium">Alex Rivera</span>
            <span className="truncate text-xs text-muted-foreground">Rivera Trading Co.</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

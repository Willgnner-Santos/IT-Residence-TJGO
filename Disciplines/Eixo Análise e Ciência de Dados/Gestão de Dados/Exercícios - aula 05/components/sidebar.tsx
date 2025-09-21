"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Cloud,
  Database,
  Settings,
  BarChart3,
  Workflow,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Activity,
  MapPin,
  Thermometer,
  Zap,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Integrações MCP",
    href: "/integrations",
    icon: Zap,
    current: false,
  },
  {
    name: "Pipeline de Dados",
    href: "/pipeline",
    icon: Workflow,
    current: false,
  },
  {
    name: "Schema Manager",
    href: "/schema",
    icon: Database,
    current: false,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Activity,
    current: false,
  },
  {
    name: "Monitoramento",
    href: "/monitoring",
    icon: Monitor,
    current: false,
  },
]

const dataCategories = [
  {
    name: "Estações Meteorológicas",
    href: "/stations",
    icon: MapPin,
  },
  {
    name: "Dados Climáticos",
    href: "/climate",
    icon: Thermometer,
  },
  {
    name: "Alertas & Previsões",
    href: "/alerts",
    icon: Cloud,
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">MeteoroData</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {!collapsed && (
          <>
            <div className="mt-8 mb-4">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dados</h3>
            </div>
            <nav className="space-y-2">
              {dataCategories.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </>
        )}
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-3">Configurações</span>}
        </Link>
      </div>
    </div>
  )
}

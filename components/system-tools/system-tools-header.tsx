"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Wrench, Shield, Workflow, Search, RefreshCw } from "lucide-react"
import { useSystemTools } from "./system-tools-context"

export function SystemToolsHeader() {
  const pathname = usePathname()
  const { refreshAllData, isLoading } = useSystemTools()

  const navItems = [
    {
      name: "概览",
      href: "/system-tools",
      icon: <Wrench className="h-4 w-4 mr-2" />,
    },
    {
      name: "系统审计",
      href: "/admin/system",
      icon: <Wrench className="h-4 w-4 mr-2" />,
    },
    {
      name: "安全检测",
      href: "/api-config/security",
      icon: <Shield className="h-4 w-4 mr-2" />,
    },
    {
      name: "变更分析",
      href: "/api-config/impact",
      icon: <Workflow className="h-4 w-4 mr-2" />,
    },
    {
      name: "高级搜索",
      href: "/api-config/search",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="border-b">
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn("flex items-center", isActive && "bg-blue-600 hover:bg-blue-700")}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllData}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            刷新数据
          </Button>
        </div>
      </div>
    </div>
  )
}

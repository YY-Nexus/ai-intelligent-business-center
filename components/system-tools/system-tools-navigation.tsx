"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wrench, Shield, Workflow, Search, ArrowRight, AlertTriangle } from "lucide-react"

interface ToolLink {
  name: string
  description: string
  icon: React.ReactNode
  href: string
  status?: "normal" | "warning" | "critical"
  statusCount?: number
}

export function SystemToolsNavigation() {
  const pathname = usePathname()

  // 系统工具链接配置
  const toolLinks: ToolLink[] = [
    {
      name: "系统审计",
      description: "全面检查系统框架完整性、文件合规性和交互流畅性",
      icon: <Wrench className="h-5 w-5" />,
      href: "/admin/system",
      status: "warning",
      statusCount: 3,
    },
    {
      name: "安全检测",
      description: "检测系统安全状况，识别潜在风险并提供修复建议",
      icon: <Shield className="h-5 w-5" />,
      href: "/api-config/security",
      status: "critical",
      statusCount: 2,
    },
    {
      name: "变更分析",
      description: "分析API变更的影响范围，评估风险并提供迁移建议",
      icon: <Workflow className="h-5 w-5" />,
      href: "/api-config/impact",
      status: "normal",
      statusCount: 5,
    },
    {
      name: "高级搜索",
      description: "强大的搜索功能，帮助您快速找到API配置、文档和代码示例",
      icon: <Search className="h-5 w-5" />,
      href: "/api-config/search",
    },
  ]

  // 获取状态图标
  const getStatusIcon = (status?: string) => {
    if (!status || status === "normal") return null

    return status === "warning" ? (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">系统工具</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {toolLinks.map((tool) => {
          const isActive = pathname === tool.href || pathname.startsWith(`${tool.href}/`)

          return (
            <Card
              key={tool.name}
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-md",
                isActive && "ring-2 ring-blue-500 shadow-md",
              )}
            >
              <Link href={tool.href} className="block p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-2 rounded-md",
                      isActive ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-muted",
                    )}
                  >
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{tool.name}</h3>
                      {getStatusIcon(tool.status)}
                      {tool.statusCount && (
                        <span
                          className={cn(
                            "text-xs rounded-full px-2 py-0.5",
                            tool.status === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : tool.status === "critical"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800",
                          )}
                        >
                          {tool.statusCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" className="gap-1">
                    {isActive ? "查看详情" : "前往工具"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Link>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

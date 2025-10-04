"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench, Shield, Workflow, Search, ArrowRight } from "lucide-react"

interface RelatedToolsProps {
  currentTool: "audit" | "security" | "impact" | "search"
}

export function SystemToolsRelatedLinks({ currentTool }: RelatedToolsProps) {
  // 工具配置
  const tools = [
    {
      id: "audit",
      name: "系统审计",
      description: "全面检查系统框架完整性、文件合规性和交互流畅性",
      icon: <Wrench className="h-5 w-5" />,
      href: "/admin/system",
    },
    {
      id: "security",
      name: "安全检测",
      description: "检测系统安全状况，识别潜在风险并提供修复建议",
      icon: <Shield className="h-5 w-5" />,
      href: "/api-config/security",
    },
    {
      id: "impact",
      name: "变更分析",
      description: "分析API变更的影响范围，评估风险并提供迁移建议",
      icon: <Workflow className="h-5 w-5" />,
      href: "/api-config/impact",
    },
    {
      id: "search",
      name: "高级搜索",
      description: "强大的搜索功能，帮助您快速找到API配置、文档和代码示例",
      icon: <Search className="h-5 w-5" />,
      href: "/api-config/search",
    },
  ]

  // 过滤掉当前工具
  const relatedTools = tools.filter((tool) => tool.id !== currentTool)

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">相关工具</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedTools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-md bg-muted">{tool.icon}</div>
                {tool.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{tool.description}</CardDescription>
              <Button asChild>
                <Link href={tool.href} className="flex items-center">
                  前往{tool.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

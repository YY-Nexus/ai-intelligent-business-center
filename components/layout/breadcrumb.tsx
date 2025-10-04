"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

// 路径映射表，用于将路径转换为可读名称
const pathMap: Record<string, string> = {
  dashboard: "数据看板",
  "api-config": "接口配置",
  settings: "系统设置",
  "ecommerce-engine": "电商引擎",
  "ai-models": "AI大模型",
  glm4v: "GLM-4V",
  cogview: "CogView",
  codegeex: "CodeGeeX",
  "batch-processor": "批量处理",
  performance: "性能测试",
  versions: "版本对比",
  analytics: "数据分析",
  admin: "管理",
  system: "系统审计",
  security: "安全检测",
  impact: "变更分析",
  search: "高级搜索",
  "api-documentation": "API文档",
  databases: "数据存储",
  "media-channels": "媒体平台",
  "business-platforms": "商业平台",
  "api-types": "接口类型",
  monitoring: "性能监控",
  documentation: "接口文档",
  history: "请求历史",
  ai: "智能助手",
  framework: "框架审计",
  "file-compliance": "文件合规性",
  interaction: "交互审计",
  "missing-features": "缺失功能",
  "market-analysis": "市场分析",
  "product-optimizer": "产品优化",
  "pricing-strategy": "定价策略",
  "competitor-tracker": "竞争追踪",
  "trend-predictor": "趋势预测",
  "sales-performance": "销售表现",
}

export function Breadcrumb() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 如果是首页，不显示面包屑
  if (pathname === "/") {
    return null
  }

  // 分割路径并过滤空字符串
  const pathSegments = pathname.split("/").filter(Boolean)

  // 构建面包屑项
  const breadcrumbItems = []

  // 添加首页
  breadcrumbItems.push({
    name: "首页",
    path: "/",
    isLast: false,
  })

  // 添加路径段
  let currentPath = ""
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    currentPath += `/${segment}`

    breadcrumbItems.push({
      name: pathMap[segment] || segment,
      path: currentPath,
      isLast: i === pathSegments.length - 1 && !searchParams.has("tab"),
    })
  }

  // 添加tab参数
  const tab = searchParams.get("tab")
  if (tab) {
    breadcrumbItems.push({
      name: pathMap[tab] || tab,
      path: `${currentPath}?tab=${tab}`,
      isLast: true,
    })
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground px-4 py-2 border-b">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Link
            href={item.path}
            className={cn("hover:text-foreground transition-colors", item.isLast ? "font-medium text-foreground" : "")}
            aria-current={item.isLast ? "page" : undefined}
          >
            {index === 0 ? <Home className="h-4 w-4" /> : item.name}
          </Link>
        </div>
      ))}
    </nav>
  )
}

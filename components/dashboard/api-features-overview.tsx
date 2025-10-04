"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  FileText,
  History,
  List,
  MonitorCheck,
  Shield,
  Sparkles,
  BarChart2,
  GitCompare,
  Search,
  Workflow,
  Boxes,
} from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  buttonText: string
  color: string
}

function FeatureCard({ icon, title, description, href, buttonText, color }: FeatureCardProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/5",
    green: "from-green-500/20 to-green-600/5 dark:from-green-500/10 dark:to-green-600/5",
    purple: "from-purple-500/20 to-purple-600/5 dark:from-purple-500/10 dark:to-purple-600/5",
    amber: "from-amber-500/20 to-amber-600/5 dark:from-amber-500/10 dark:to-amber-600/5",
    red: "from-red-500/20 to-red-600/5 dark:from-red-500/10 dark:to-red-600/5",
    cyan: "from-cyan-500/20 to-cyan-600/5 dark:from-cyan-500/10 dark:to-cyan-600/5",
  }

  const iconColorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    amber: "text-amber-500",
    red: "text-red-500",
    cyan: "text-cyan-500",
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} pb-3`}>
        <div className="flex items-center gap-2">
          <div className={`rounded-md p-1.5 ${iconColorClasses[color as keyof typeof iconColorClasses]}`}>{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-3 pb-3">
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full">
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function ApiFeaturesOverview() {
  const features: FeatureCardProps[] = [
    {
      icon: <List className="h-5 w-5" />,
      title: "API配置管理",
      description: "创建和管理API配置，设置认证和请求参数",
      href: "/api-config?tab=list",
      buttonText: "管理API配置",
      color: "blue",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "API监控",
      description: "监控API状态、响应时间和可用性",
      href: "/api-config?tab=monitoring",
      buttonText: "查看监控",
      color: "green",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "API文档",
      description: "自动生成和管理API文档",
      href: "/api-config?tab=documentation",
      buttonText: "管理文档",
      color: "purple",
    },
    {
      icon: <History className="h-5 w-5" />,
      title: "请求历史",
      description: "查看和分析API请求历史记录",
      href: "/api-config?tab=history",
      buttonText: "查看历史",
      color: "amber",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "AI助手",
      description: "AI驱动的API管理助手",
      href: "/api-config?tab=ai",
      buttonText: "使用AI助手",
      color: "cyan",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "安全分析",
      description: "分析API安全性并提供改进建议",
      href: "/api-config/security",
      buttonText: "安全分析",
      color: "red",
    },
    {
      icon: <Boxes className="h-5 w-5" />,
      title: "批量操作",
      description: "批量管理和操作多个API",
      href: "/api-config/batch",
      buttonText: "批量操作",
      color: "blue",
    },
    {
      icon: <MonitorCheck className="h-5 w-5" />,
      title: "性能测试",
      description: "测试API性能和负载能力",
      href: "/api-config/performance",
      buttonText: "性能测试",
      color: "green",
    },
    {
      icon: <GitCompare className="h-5 w-5" />,
      title: "版本比较",
      description: "比较API配置的不同版本",
      href: "/api-config/versions",
      buttonText: "版本比较",
      color: "purple",
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      title: "使用统计",
      description: "查看API使用情况和统计数据",
      href: "/api-config/analytics",
      buttonText: "使用统计",
      color: "amber",
    },
    {
      icon: <Workflow className="h-5 w-5" />,
      title: "变更影响",
      description: "分析API变更的影响范围",
      href: "/api-config/impact",
      buttonText: "变更影响",
      color: "cyan",
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "高级搜索",
      description: "高级搜索和过滤API配置",
      href: "/api-config/search",
      buttonText: "高级搜索",
      color: "red",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API功能概览</h2>
        <p className="text-muted-foreground">探索API-OS提供的全部功能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  )
}

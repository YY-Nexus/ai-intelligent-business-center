"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Settings,
  LineChart,
  History,
  ShieldCheck,
  Bot,
  FileText,
  Zap,
  Brain,
  BarChart,
  Cloud,
  Laptop,
  ImageIcon,
  Code,
} from "lucide-react"

export default function ApiConfigPage() {
  const [services] = useState([
    {
      title: "智谱AI",
      description: "配置智谱AI大模型接口，包括GLM-4、GLM-3-Turbo等",
      href: "/api-config/zhipu",
      icon: <Brain className="h-10 w-10 text-primary" />,
      new: true,
    },
    {
      title: "文心一言",
      description: "百度开发的大型语言模型服务",
      href: "/api-config/wenxin",
      icon: <Bot className="h-10 w-10 text-primary" />,
    },
    {
      title: "讯飞星火",
      description: "科大讯飞开发的认知大模型",
      href: "/api-config/spark",
      icon: <Zap className="h-10 w-10 text-primary" />,
    },
    {
      title: "通义千问",
      description: "阿里云开发的大语言模型",
      href: "/api-config/qwen",
      icon: <Cloud className="h-10 w-10 text-primary" />,
    },
    {
      title: "混元",
      description: "腾讯开发的大语言模型",
      href: "/api-config/hunyuan",
      icon: <Laptop className="h-10 w-10 text-primary" />,
    },
    {
      title: "GLM-4V",
      description: "智谱AI的图像多模态模型",
      href: "/api-config/glm4v",
      icon: <ImageIcon className="h-10 w-10 text-primary" />,
      new: true,
    },
    {
      title: "CodeGeeX",
      description: "智谱AI的代码生成模型",
      href: "/api-config/codegeex",
      icon: <Code className="h-10 w-10 text-primary" />,
    },
    {
      title: "认知视觉",
      description: "智谱AI的图像生成模型",
      href: "/api-config/cogview",
      icon: <ImageIcon className="h-10 w-10 text-primary" />,
    },
    {
      title: "文件处理",
      description: "智谱AI的文件提取和处理服务",
      href: "/api-config/file-extract",
      icon: <FileText className="h-10 w-10 text-primary" />,
    },
    {
      title: "模型比较",
      description: "比较不同AI模型的性能和功能",
      href: "/api-config/model-comparison",
      icon: <BarChart className="h-10 w-10 text-primary" />,
    },
    {
      title: "批量处理",
      description: "批量处理API请求和响应",
      href: "/api-config/batch-processor",
      icon: <Zap className="h-10 w-10 text-primary" />,
    },
    {
      title: "安全分析",
      description: "API安全与合规分析",
      href: "/api-config/security",
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    },
    {
      title: "监控分析",
      description: "API使用监控与分析",
      href: "/api-config/analytics",
      icon: <LineChart className="h-10 w-10 text-primary" />,
    },
    {
      title: "性能测试",
      description: "API性能测试与优化",
      href: "/api-config/performance",
      icon: <Zap className="h-10 w-10 text-primary" />,
    },
    {
      title: "使用历史",
      description: "API调用历史记录",
      href: "/api-config/history",
      icon: <History className="h-10 w-10 text-primary" />,
    },
    {
      title: "版本管理",
      description: "API版本管理与比较",
      href: "/api-config/versions",
      icon: <Settings className="h-10 w-10 text-primary" />,
    },
  ])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API配置中心</h1>
          <p className="text-muted-foreground mt-1">配置和管理各种API服务，包括中国大模型服务和其他AI服务</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link href={service.href} key={index} className="block">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2">{service.icon}</div>
                    {service.new && (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        新增
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    配置
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

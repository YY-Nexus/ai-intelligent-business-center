"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle, CheckCircle2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Feature {
  id: string
  name: string
  description: string
  category: string
  priority: "high" | "medium" | "low"
  implemented: boolean
}

export interface MissingFeaturesAuditProps {
  projectType?: string
}

export function MissingFeaturesAudit({ projectType = "Web应用" }: MissingFeaturesAuditProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // 模拟特性数据
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "auth",
      name: "用户认证",
      description: "包括登录、注册、密码重置和会话管理",
      category: "安全",
      priority: "high",
      implemented: true,
    },
    {
      id: "roles",
      name: "角色权限",
      description: "基于角色的访问控制系统",
      category: "安全",
      priority: "high",
      implemented: false,
    },
    {
      id: "2fa",
      name: "双因素认证",
      description: "增强账户安全的第二层验证",
      category: "安全",
      priority: "medium",
      implemented: false,
    },
    {
      id: "analytics",
      name: "数据分析",
      description: "用户行为和系统性能分析",
      category: "监控",
      priority: "medium",
      implemented: true,
    },
    {
      id: "notifications",
      name: "通知系统",
      description: "实时和电子邮件通知功能",
      category: "用户体验",
      priority: "medium",
      implemented: false,
    },
    {
      id: "api-docs",
      name: "API文档",
      description: "自动生成的API文档",
      category: "开发者工具",
      priority: "low",
      implemented: false,
    },
    {
      id: "dark-mode",
      name: "暗色模式",
      description: "用户界面的暗色主题支持",
      category: "用户体验",
      priority: "low",
      implemented: true,
    },
  ])

  const categories = ["all", ...Array.from(new Set(features.map((f) => f.category)))]

  const toggleFeatureImplementation = (id: string) => {
    setFeatures(
      features.map((feature) => (feature.id === id ? { ...feature, implemented: !feature.implemented } : feature)),
    )
  }

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const missingFeaturesCount = features.filter((f) => !f.implemented).length
  const implementedFeaturesCount = features.filter((f) => f.implemented).length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>功能完整性审计</CardTitle>
        <CardDescription>检查{projectType}是否实现了所有必要功能</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索功能..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "所有分类" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              已实现: {implementedFeaturesCount}
            </span>
            <span className="flex items-center">
              <MinusCircle className="h-4 w-4 mr-1 text-amber-500" />
              缺失: {missingFeaturesCount}
            </span>
          </div>

          <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-4">
              {filteredFeatures.length > 0 ? (
                filteredFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-2 pb-3 border-b last:border-0">
                    <Checkbox
                      id={feature.id}
                      checked={feature.implemented}
                      onCheckedChange={() => toggleFeatureImplementation(feature.id)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor={feature.id} className="text-base font-medium flex items-center">
                        {feature.name}
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            feature.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : feature.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {feature.priority === "high"
                            ? "高优先级"
                            : feature.priority === "medium"
                              ? "中优先级"
                              : "低优先级"}
                        </span>
                      </Label>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <div className="text-xs text-muted-foreground">分类: {feature.category}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Search className="h-8 w-8 mb-2 opacity-20" />
                  <p>没有找到匹配的功能</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            添加自定义功能
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  RefreshCw,
  Settings,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Zap,
  TrendingUp,
  CheckCircle2,
  Filter,
  SortAsc,
  Download,
} from "lucide-react"

export default function AiInsightsPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <TechLayout backgroundVariant="vortex" backgroundIntensity="light">
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard">
            <TechButton variant="outline" size="sm" depth="flat" icon={<ArrowLeft className="h-4 w-4" />}>
              返回数据看板
            </TechButton>
          </Link>
          <div className="h-6 border-l border-border"></div>
          <h1 className="text-2xl font-bold">AI洞察</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">AI驱动的系统洞察与优化建议</h2>
            <p className="text-sm text-muted-foreground">基于数据分析的智能见解与性能优化建议</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Input placeholder="搜索洞察..." className="w-[200px]" />
            <TechButton variant="outline" depth="flat" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              刷新洞察
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<Settings className="h-4 w-4" />}>
              AI设置
            </TechButton>
            <TechButton variant="primary" depth="3d" glow="soft" size="sm" icon={<Sparkles className="h-4 w-4" />}>
              生成新洞察
            </TechButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">洞察数量</p>
                <h3 className="text-2xl font-bold">24</h3>
                <p className="text-xs text-muted-foreground">
                  较上周 <span className="text-green-500">+3</span>
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待处理问题</p>
                <h3 className="text-2xl font-bold">7</h3>
                <p className="text-xs text-muted-foreground">
                  较上周 <span className="text-red-500">+2</span>
                </p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">优化建议</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-xs text-muted-foreground">
                  较上周 <span className="text-green-500">+5</span>
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">性能提升</p>
                <h3 className="text-2xl font-bold">18%</h3>
                <p className="text-xs text-muted-foreground">
                  较上月 <span className="text-green-500">+4%</span>
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </TechCard>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <TechCard variant="glass" border="tech" className="mb-6">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">系统洞察</h3>
                  <div className="flex items-center gap-2">
                    <TechButton variant="outline" depth="flat" size="xs" icon={<Filter className="h-3.5 w-3.5" />}>
                      筛选
                    </TechButton>
                    <TechButton variant="outline" depth="flat" size="xs" icon={<SortAsc className="h-3.5 w-3.5" />}>
                      排序
                    </TechButton>
                    <TechButton variant="outline" depth="flat" size="xs" icon={<Download className="h-3.5 w-3.5" />}>
                      导出
                    </TechButton>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <div className="px-4 pt-2">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="critical">紧急</TabsTrigger>
                    <TabsTrigger value="performance">性能</TabsTrigger>
                    <TabsTrigger value="security">安全</TabsTrigger>
                    <TabsTrigger value="optimization">优化</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                  <ScrollArea className="h-[500px]">
                    <InsightsList />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="critical" className="m-0">
                  <ScrollArea className="h-[500px]">
                    <InsightsList filter="critical" />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="performance" className="m-0">
                  <ScrollArea className="h-[500px]">
                    <InsightsList filter="performance" />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="security" className="m-0">
                  <ScrollArea className="h-[500px]">
                    <InsightsList filter="security" />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="optimization" className="m-0">
                  <ScrollArea className="h-[500px]">
                    <InsightsList filter="optimization" />
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className="p-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">显示 1-10 条，共 24 条</p>
                <div className="flex items-center gap-2">
                  <TechButton variant="outline" depth="flat" size="sm" disabled>
                    上一页
                  </TechButton>
                  <TechButton variant="outline" depth="flat" size="sm">
                    下一页
                  </TechButton>
                </div>
              </div>
            </TechCard>
          </div>

          <div className="w-full lg:w-1/4">
            <TechCard variant="glass" border="tech" className="mb-6">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">洞察详情</h3>
              </div>

              {activeTab === "all" ? (
                <div className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="p-4 bg-muted/30 rounded-full mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">选择一条洞察</h4>
                  <p className="text-sm text-muted-foreground mb-4">点击左侧列表中的任意洞察项目查看详细信息</p>
                  <TechButton variant="outline" depth="flat" size="sm">
                    生成概览报告
                  </TechButton>
                </div>
              ) : (
                <div className="p-4">
                  <div className="mb-4">
                    <Badge
                      variant={
                        activeTab === "critical" ? "destructive" : activeTab === "performance" ? "default" : "outline"
                      }
                      className="mb-2"
                    >
                      {activeTab === "critical"
                        ? "紧急"
                        : activeTab === "performance"
                          ? "性能"
                          : activeTab === "security"
                            ? "安全"
                            : "优化"}
                    </Badge>
                    <h4 className="text-lg font-medium mb-1">
                      {activeTab === "critical"
                        ? "API响应时间异常增长"
                        : activeTab === "performance"
                          ? "数据库查询优化空间"
                          : activeTab === "security"
                            ? "发现潜在安全漏洞"
                            : "代码冗余优化建议"}
                    </h4>
                    <p className="text-sm text-muted-foreground">发现时间: 2025-05-14 16:32</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-1">问题描述</h5>
                      <p className="text-sm text-muted-foreground">
                        {activeTab === "critical"
                          ? "系统检测到过去24小时内API响应时间增长了47%，超出了正常阈值。这可能导致用户体验下降和系统超时。"
                          : activeTab === "performance"
                            ? "数据库查询分析显示有5个常用查询可优化，预计可减少30%的数据库负载。"
                            : activeTab === "security"
                              ? "在身份验证流程中发现了潜在的安全漏洞，可能导致未授权访问。"
                              : "代码分析发现多处冗余逻辑，优化后可提升应用性能约15%。"}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-1">影响范围</h5>
                      <p className="text-sm text-muted-foreground">
                        {activeTab === "critical"
                          ? "影响所有API调用，特别是高流量端点。约75%的用户请求受到影响。"
                          : activeTab === "performance"
                            ? "主要影响用户数据检索和报表生成功能，高峰期可能导致延迟。"
                            : activeTab === "security"
                              ? "影响所有使用标准登录流程的用户账户，约占总用户的95%。"
                              : "影响前端渲染性能和后端数据处理效率，全局范围。"}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-1">建议解决方案</h5>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-sm">
                            {activeTab === "critical"
                              ? "检查并优化数据库连接池配置"
                              : activeTab === "performance"
                                ? "为频繁访问的字段添加索引"
                                : activeTab === "security"
                                  ? "实施多因素身份验证"
                                  : "合并重复的工具函数"}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-sm">
                            {activeTab === "critical"
                              ? "实施API请求缓存策略"
                              : activeTab === "performance"
                                ? "优化JOIN查询结构"
                                : activeTab === "security"
                                  ? "更新身份验证库至最新版本"
                                  : "实施代码分割和懒加载"}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-sm">
                            {activeTab === "critical"
                              ? "增加服务器资源或启用自动扩展"
                              : activeTab === "performance"
                                ? "实施查询结果缓存"
                                : activeTab === "security"
                                  ? "审查并更新权限验证逻辑"
                                  : "优化状态管理逻辑"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <TechButton variant="primary" depth="3d" glow="soft" size="sm" className="flex-1">
                      应用修复
                    </TechButton>
                    <TechButton variant="outline" depth="flat" size="sm">
                      忽略
                    </TechButton>
                  </div>
                </div>
              )}
            </TechCard>

            <TechCard variant="glass" border="tech">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">AI模型设置</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">当前模型</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">GLM-4V</p>
                    <Badge variant="outline">专业版</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">分析频率</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">每6小时</p>
                    <TechButton variant="outline" depth="flat" size="xs">
                      修改
                    </TechButton>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">优先级设置</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">性能 > 安全 > 优化</p>
                    <TechButton variant="outline" depth="flat" size="xs">
                      修改
                    </TechButton>
                  </div>
                </div>

                <TechButton variant="outline" depth="flat" size="sm" className="w-full">
                  高级设置
                </TechButton>
              </div>
            </TechCard>
          </div>
        </div>
      </div>
    </TechLayout>
  )
}

function InsightsList({ filter = "all" }) {
  // 模拟数据
  const insights = [
    {
      id: 1,
      title: "API响应时间异常增长",
      description: "系统检测到过去24小时内API响应时间增长了47%，超出了正常阈值。",
      type: "critical",
      time: "2小时前",
      status: "未处理",
    },
    {
      id: 2,
      title: "数据库查��优化空间",
      description: "数据库查询分析显示有5个常用查询可优化，预计可减少30%的数据库负载。",
      type: "performance",
      time: "4小时前",
      status: "未处理",
    },
    {
      id: 3,
      title: "发现潜在安全漏洞",
      description: "在身份验证流程中发现了潜在的安全漏洞，可能导致未授权访问。",
      type: "security",
      time: "6小时前",
      status: "处理中",
    },
    {
      id: 4,
      title: "代码冗余优化建议",
      description: "代码分析发现多处冗余逻辑，优化后可提升应用性能约15%。",
      type: "optimization",
      time: "1天前",
      status: "已解决",
    },
    {
      id: 5,
      title: "缓存策略改进空间",
      description: "当前缓存策略效率低下，建议调整缓存时间和存储策略。",
      type: "performance",
      time: "1天前",
      status: "未处理",
    },
    {
      id: 6,
      title: "用户认证流程优化",
      description: "当前认证流程步骤过多，可简化以提升用户体验。",
      type: "optimization",
      time: "2天前",
      status: "已解决",
    },
    {
      id: 7,
      title: "内存泄漏风险",
      description: "检测到潜在的内存泄漏问题，可能导致长时间运行后系统不稳定。",
      type: "critical",
      time: "2天前",
      status: "处理中",
    },
    {
      id: 8,
      title: "API权限配置问题",
      description: "部分API端点权限配置过于宽松，存在安全风险。",
      type: "security",
      time: "3天前",
      status: "未处理",
    },
  ]

  const filteredInsights = filter === "all" ? insights : insights.filter((insight) => insight.type === filter)

  return (
    <div className="divide-y divide-border">
      {filteredInsights.map((insight) => (
        <div key={insight.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    insight.type === "critical"
                      ? "destructive"
                      : insight.type === "performance"
                        ? "default"
                        : insight.type === "security"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {insight.type === "critical"
                    ? "紧急"
                    : insight.type === "performance"
                      ? "性能"
                      : insight.type === "security"
                        ? "安全"
                        : "优化"}
                </Badge>
                <span className="text-xs text-muted-foreground">{insight.time}</span>
              </div>
              <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge
                variant={
                  insight.status === "未处理" ? "outline" : insight.status === "处理中" ? "secondary" : "success"
                }
                className="whitespace-nowrap"
              >
                {insight.status}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

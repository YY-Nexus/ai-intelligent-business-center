"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TechButton } from "@/components/ui/tech-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { YanYuLogo } from "@/components/ui/yanyu-logo"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Code,
  Database,
  FileText,
  Gauge,
  Rocket,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [stats, setStats] = useState({
    totalAPIs: 0,
    activeConnections: 0,
    successRate: 0,
    responseTime: 0,
  })

  useEffect(() => {
    setIsLoaded(true)

    // 模拟统计数据动画
    const animateStats = () => {
      const targets = { totalAPIs: 156, activeConnections: 89, successRate: 99.8, responseTime: 45 }
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          totalAPIs: Math.floor(targets.totalAPIs * progress),
          activeConnections: Math.floor(targets.activeConnections * progress),
          successRate: Math.floor(targets.successRate * progress * 10) / 10,
          responseTime: Math.floor(targets.responseTime * progress),
        })

        if (currentStep >= steps) {
          clearInterval(timer)
          setStats(targets)
        }
      }, stepDuration)
    }

    setTimeout(animateStats, 500)
  }, [])

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI智能助手",
      description: "基于大语言模型的智能API管理助手，提供自然语言交互和智能建议",
      href: "/api-config?tab=ai",
      isAI: true,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "统一API管理",
      description: "集中管理所有API配置，支持多种认证方式和协议",
      href: "/api-config",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "实时监控",
      description: "全方位监控API性能，实时告警和智能分析",
      href: "/api-config?tab=monitoring",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "智能文档",
      description: "AI自动生成API文档，支持多种格式导出",
      href: "/api-documentation",
      isAI: true,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "安全防护",
      description: "多层安全防护机制，保障API调用安全",
      href: "/api-config/security",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "数据分析",
      description: "深度数据分析和可视化，洞察API使用趋势",
      href: "/api-config/analytics",
      color: "from-teal-500 to-blue-500",
    },
  ]

  const quickActions = [
    {
      title: "创建API配置",
      description: "快速创建新的API配置",
      href: "/api-config?tab=form",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      title: "查看监控面板",
      description: "实时监控API状态",
      href: "/dashboard",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: "AI智能助手",
      description: "获取AI帮助和建议",
      href: "/api-config?tab=ai",
      icon: <Brain className="h-5 w-5" />,
      isAI: true,
    },
    {
      title: "浏览文档",
      description: "查看API文档和示例",
      href: "/api-documentation",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  const recentActivities = [
    {
      type: "success",
      title: "GLM-4V API配置成功",
      description: "智谱AI多模态模型已成功配置",
      time: "2分钟前",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      type: "info",
      title: "性能监控报告",
      description: "API响应时间优化了15%",
      time: "10分钟前",
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
    },
    {
      type: "warning",
      title: "安全扫描完成",
      description: "发现3个潜在安全问题",
      time: "1小时前",
      icon: <Shield className="h-4 w-4 text-yellow-500" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10 animate-gradient-x bg-size-200" />

        <div className="container mx-auto text-center relative z-10">
          <div
            className={cn(
              "transition-all duration-1000",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <YanYuLogo size="xl" animated="entrance" className="mx-auto mb-8 smart-glow pulse-glow" />

            <h1 className="text-5xl md:text-7xl font-bold mb-6 yanyu-text-gradient">言语云³</h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AI驱动的智能API管理平台，让API集成变得简单而强大
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <TechButton size="lg" variant="ai" className="text-lg px-8 py-4" asChild>
                <Link href="/api-config">
                  <Rocket className="mr-2 h-5 w-5" />
                  开始使用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </TechButton>

              <TechButton size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link href="/api-documentation">
                  <FileText className="mr-2 h-5 w-5" />
                  查看文档
                </Link>
              </TechButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center smart-interactive card-3d smart-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold yanyu-text-gradient mb-2">{stats.totalAPIs}+</div>
                <p className="text-sm text-muted-foreground">API配置</p>
              </CardContent>
            </Card>

            <Card className="text-center smart-interactive card-3d smart-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold yanyu-text-gradient mb-2">{stats.activeConnections}</div>
                <p className="text-sm text-muted-foreground">活跃连接</p>
              </CardContent>
            </Card>

            <Card className="text-center smart-interactive card-3d smart-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold yanyu-text-gradient mb-2">{stats.successRate}%</div>
                <p className="text-sm text-muted-foreground">成功率</p>
              </CardContent>
            </Card>

            <Card className="text-center smart-interactive card-3d smart-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold yanyu-text-gradient mb-2">{stats.responseTime}ms</div>
                <p className="text-sm text-muted-foreground">平均响应</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 yanyu-text-gradient">核心功能</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">集成AI技术的全方位API管理解决方案</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={cn(
                  "group smart-interactive card-3d flowing-light gradient-border",
                  feature.isAI && "ai-enhanced pulse-glow",
                )}
              >
                <CardHeader>
                  <div
                    className={cn(
                      "w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-r shadow-lg group-hover:scale-110 transition-transform duration-300",
                      feature.color,
                    )}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {feature.title}
                    {feature.isAI && <Brain className="h-4 w-4 text-purple-500 animate-pulse" />}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <TechButton
                    variant={feature.isAI ? "ai" : "outline"}
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                    asChild
                  >
                    <Link href={feature.href}>
                      了解更多
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </TechButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions & Recent Activities */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Quick Actions */}
            <div>
              <h3 className="text-2xl font-bold mb-6 yanyu-text-gradient">快速操作</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "smart-interactive micro-interaction flowing-light",
                      action.isAI && "ai-enhanced gradient-border",
                    )}
                  >
                    <CardContent className="p-4">
                      <Link href={action.href} className="flex items-center gap-4 group">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white group-hover:scale-110 transition-transform duration-300",
                            action.isAI && "from-purple-500 to-pink-500",
                          )}
                        >
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            {action.title}
                            {action.isAI && <Brain className="h-4 w-4 text-purple-500" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <h3 className="text-2xl font-bold mb-6 yanyu-text-gradient">最近活动</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <Card key={index} className="smart-interactive micro-interaction">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{activity.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-4xl mx-auto smart-glow ai-enhanced">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4 yanyu-text-gradient">准备开始您的AI API之旅？</h2>
              <p className="text-xl text-muted-foreground mb-8">加入数千家企业，体验AI驱动的API管理平台</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <TechButton size="lg" variant="ai" className="text-lg px-8 py-4" asChild>
                  <Link href="/auth/register">
                    <Users className="mr-2 h-5 w-5" />
                    立即注册
                  </Link>
                </TechButton>
                <TechButton size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                  <Link href="/api-examples">
                    <Code className="mr-2 h-5 w-5" />
                    查看示例
                  </Link>
                </TechButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  History,
  Layers,
  MonitorCheck,
  PlusCircle,
  Settings,
  Shield,
  Sparkles,
  ArrowUpRight,
  BarChart,
  ChevronRight,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <TechLayout backgroundVariant="vortex" backgroundIntensity="medium">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-techblue-700 dark:text-techblue-300">数据看板</h1>
            <p className="text-muted-foreground mt-1">全面监控系统状态与性能指标</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/settings">
              <TechButton variant="outline" depth="flat" icon={<Settings className="h-4 w-4" />}>
                ���板设置
              </TechButton>
            </Link>
            <Link href="/api-config?tab=form">
              <TechButton
                variant="gradient"
                depth="3d"
                animated
                glow="strong"
                icon={<PlusCircle className="h-4 w-4" />}
              >
                添加API
              </TechButton>
            </Link>
          </div>
        </div>

        {/* 快速访问导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/api-analytics">
            <TechCard
              variant="glass"
              border="tech"
              glow="subtle"
              animation="float"
              contentClassName="p-5 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">API分析</p>
                  <h2 className="text-2xl font-bold text-techblue-700 dark:text-techblue-300 mt-1">
                    详细指标
                    <ChevronRight className="h-4 w-4 inline ml-1" />
                  </h2>
                </div>
                <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-techblue-500" />
                </div>
              </div>
            </TechCard>
          </Link>

          <Link href="/dashboard/performance">
            <TechCard
              variant="glass"
              border="tech"
              glow="subtle"
              animation="float"
              contentClassName="p-5 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">性能监控</p>
                  <h2 className="text-2xl font-bold text-techblue-700 dark:text-techblue-300 mt-1">
                    实时跟踪
                    <ChevronRight className="h-4 w-4 inline ml-1" />
                  </h2>
                </div>
                <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-techblue-500" />
                </div>
              </div>
            </TechCard>
          </Link>

          <Link href="/dashboard/history">
            <TechCard
              variant="glass"
              border="tech"
              glow="subtle"
              animation="float"
              contentClassName="p-5 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">操作历史</p>
                  <h2 className="text-2xl font-bold text-techblue-700 dark:text-techblue-300 mt-1">
                    完整记录
                    <ChevronRight className="h-4 w-4 inline ml-1" />
                  </h2>
                </div>
                <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 rounded-full">
                  <History className="h-6 w-6 text-techblue-500" />
                </div>
              </div>
            </TechCard>
          </Link>

          <Link href="/dashboard/ai-insights">
            <TechCard
              variant="glass"
              border="tech"
              glow="subtle"
              animation="float"
              contentClassName="p-5 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">AI洞察</p>
                  <h2 className="text-2xl font-bold text-techblue-700 dark:text-techblue-300 mt-1">
                    智能建议
                    <ChevronRight className="h-4 w-4 inline ml-1" />
                  </h2>
                </div>
                <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-techblue-500" />
                </div>
              </div>
            </TechCard>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4 bg-techblue-100/50 dark:bg-techblue-800/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              概览
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              监控
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              活动
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              洞察分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TechCard
                variant="panel"
                className="md:col-span-2"
                title="API状态概览"
                description="所有API的当前状态和健康度"
                glow="subtle"
                footer={
                  <Link href="/dashboard/api-analytics" className="w-full">
                    <TechButton
                      variant="gradient"
                      depth="3d"
                      className="w-full"
                      animated
                      icon={<MonitorCheck className="h-4 w-4" />}
                    >
                      查看详细监控
                    </TechButton>
                  </Link>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/50 dark:bg-techblue-900/50">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-techblue-500 mr-2" />
                      <div>
                        <p className="font-medium">用户API</p>
                        <p className="text-sm text-muted-foreground">https://api.example.com/users</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200 mr-2">
                        正常
                      </Badge>
                      <p className="text-sm">98ms</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/50 dark:bg-techblue-900/50">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-techblue-500 mr-2" />
                      <div>
                        <p className="font-medium">产品API</p>
                        <p className="text-sm text-muted-foreground">https://api.example.com/products</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200 mr-2">
                        正常
                      </Badge>
                      <p className="text-sm">112ms</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/50 dark:bg-techblue-900/50">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="font-medium">订单API</p>
                        <p className="text-sm text-muted-foreground">https://api.example.com/orders</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200 mr-2">
                        响应缓慢
                      </Badge>
                      <p className="text-sm">1.2s</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/50 dark:bg-techblue-900/50">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <p className="font-medium">支付API</p>
                        <p className="text-sm text-muted-foreground">https://api.example.com/payments</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200 mr-2">
                        不可用
                      </Badge>
                      <p className="text-sm">-</p>
                    </div>
                  </div>
                </div>
              </TechCard>

              <TechCard
                variant="panel"
                title="最近活动"
                description="系统最近的活动记录"
                glow="subtle"
                footer={
                  <Link href="/dashboard/history" className="w-full">
                    <TechButton
                      variant="gradient"
                      depth="3d"
                      className="w-full"
                      animated
                      icon={<History className="h-4 w-4" />}
                    >
                      查看所有活动
                    </TechButton>
                  </Link>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-techblue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">API监控警报</p>
                      <p className="text-xs text-muted-foreground">支付API不可用</p>
                      <p className="text-xs text-muted-foreground">10分钟前</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-techblue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">文档生成</p>
                      <p className="text-xs text-muted-foreground">用户API文档已更新</p>
                      <p className="text-xs text-muted-foreground">30分钟前</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-techblue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">安全分析</p>
                      <p className="text-xs text-muted-foreground">产品API安全分析完成</p>
                      <p className="text-xs text-muted-foreground">1小时前</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-techblue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">API配置更新</p>
                      <p className="text-xs text-muted-foreground">订单API配置已更新</p>
                      <p className="text-xs text-muted-foreground">2小时前</p>
                    </div>
                  </div>
                </div>
              </TechCard>
            </div>

            {/* 核心指标卡片组 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <TechCard variant="glass" border="tech" contentClassName="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">总API请求数</h3>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">18,392</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>12.5%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs 上周期</p>
              </TechCard>

              <TechCard variant="glass" border="tech" contentClassName="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">平均响应时间</h3>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">287ms</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>8.3%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs 上周期</p>
              </TechCard>

              <TechCard variant="glass" border="tech" contentClassName="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">错误率</h3>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">1.4%</div>
                  <div className="text-sm text-red-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>0.3%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs 上周期</p>
              </TechCard>

              <TechCard variant="glass" border="tech" contentClassName="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">API可用性</h3>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>0.2%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs 上周期</p>
              </TechCard>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <TechCard
              variant="panel"
              title="API监控详情"
              description="所有API的监控状态和性能指标"
              glow="subtle"
              footer={
                <Link href="/dashboard/performance" className="w-full">
                  <TechButton
                    variant="gradient"
                    depth="3d"
                    className="w-full"
                    animated
                    icon={<MonitorCheck className="h-4 w-4" />}
                  >
                    查看详细监控
                  </TechButton>
                </Link>
              }
            >
              <div className="space-y-6">
                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                    <div>API名称</div>
                    <div>状态</div>
                    <div>响应时间</div>
                    <div>可用性</div>
                    <div>最后检查</div>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>用户API</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          正常
                        </Badge>
                      </div>
                      <div>98ms</div>
                      <div>100%</div>
                      <div>2分钟前</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>产品API</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          正常
                        </Badge>
                      </div>
                      <div>112ms</div>
                      <div>99.8%</div>
                      <div>3分钟前</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>订单API</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                          响应缓慢
                        </Badge>
                      </div>
                      <div>1.2s</div>
                      <div>98.5%</div>
                      <div>1分钟前</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>支付API</div>
                      <div>
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">不可用</Badge>
                      </div>
                      <div>-</div>
                      <div>85.2%</div>
                      <div>刚刚</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>库存API</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          正常
                        </Badge>
                      </div>
                      <div>87ms</div>
                      <div>99.9%</div>
                      <div>5分钟前</div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="activity">
            <TechCard
              variant="panel"
              title="系统活动日志"
              description="系统中的所有活动记录"
              glow="subtle"
              footer={
                <Link href="/dashboard/history" className="w-full">
                  <TechButton
                    variant="gradient"
                    depth="3d"
                    className="w-full"
                    animated
                    icon={<History className="h-4 w-4" />}
                  >
                    查看所有活动
                  </TechButton>
                </Link>
              }
            >
              <div className="space-y-4">
                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="grid grid-cols-4 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                    <div>时间</div>
                    <div>活动类型</div>
                    <div>详情</div>
                    <div>状态</div>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <div>10分钟前</div>
                      <div>监控警报</div>
                      <div>支付API不可用</div>
                      <div>
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">警报</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <div>30分钟前</div>
                      <div>文档生成</div>
                      <div>用户API文档已更新</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <div>1小时前</div>
                      <div>安全分析</div>
                      <div>产品API安全分析完成</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                          警告
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <div>2小时前</div>
                      <div>配置更新</div>
                      <div>订单API配置已更新</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <div>3小时前</div>
                      <div>API测试</div>
                      <div>库存API测试完成</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TechCard
                variant="panel"
                title="API性能洞察"
                description="基于AI分析的性能改进建议"
                glow="subtle"
                footer={
                  <Link href="/dashboard/ai-insights" className="w-full">
                    <TechButton
                      variant="gradient"
                      depth="3d"
                      className="w-full"
                      animated
                      icon={<Sparkles className="h-4 w-4" />}
                    >
                      查看所有洞察
                    </TechButton>
                  </Link>
                }
              >
                <div className="space-y-4">
                  <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-5 w-5 text-techblue-500 mr-2" />
                      <h4 className="font-medium">订单API响应时间优化</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      订单API的响应时间已连续3天超过1秒。建议检查数据库查询效率，添加适当的索引可能会提高性能。
                    </p>
                    <div className="mt-3 flex">
                      <Link href="/dashboard/ai-insights/order-api-optimization">
                        <TechButton variant="outline" depth="flat" size="sm">
                          查看详情
                        </TechButton>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-5 w-5 text-techblue-500 mr-2" />
                      <h4 className="font-medium">用户API流量模式</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      检测到用户API在每天10:00-12:00期间流量激增。建议考虑在此时间段增加资源分配或实施缓存策略。
                    </p>
                    <div className="mt-3 flex">
                      <Link href="/dashboard/ai-insights/user-api-patterns">
                        <TechButton variant="outline" depth="flat" size="sm">
                          查看详情
                        </TechButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </TechCard>

              <TechCard
                variant="panel"
                title="系统健康状况"
                description="整体系统健康评估与建议"
                glow="subtle"
                footer={
                  <Link href="/dashboard/system-health" className="w-full">
                    <TechButton
                      variant="gradient"
                      depth="3d"
                      className="w-full"
                      animated
                      icon={<Shield className="h-4 w-4" />}
                    >
                      查看系统健康报告
                    </TechButton>
                  </Link>
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">总体健康评分</h3>
                    <div className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200 text-sm font-medium py-1 px-3 rounded-full">
                      91/100
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">API性能</span>
                        <span className="text-sm">92%</span>
                      </div>
                      <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                        <div className="h-full bg-techblue-500 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">系统稳定性</span>
                        <span className="text-sm">95%</span>
                      </div>
                      <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                        <div className="h-full bg-techblue-500 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">数据安全</span>
                        <span className="text-sm">88%</span>
                      </div>
                      <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                        <div className="h-full bg-techblue-500 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">资源利用</span>
                        <span className="text-sm">84%</span>
                      </div>
                      <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                        <div className="h-full bg-techblue-500 rounded-full" style={{ width: "84%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TechCard>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TechCard variant="panel" title="功能快速访问" description="常用功能快速入口" glow="subtle">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/api-config?tab=form">
                <TechButton
                  variant="glass"
                  depth="3d"
                  className="w-full h-24 flex flex-col items-center justify-center"
                  animated
                  glow="subtle"
                >
                  <PlusCircle className="h-8 w-8 mb-2 text-techblue-500" />
                  <span>添加API</span>
                </TechButton>
              </Link>
              <Link href="/dashboard/performance">
                <TechButton
                  variant="glass"
                  depth="3d"
                  className="w-full h-24 flex flex-col items-center justify-center"
                  animated
                  glow="subtle"
                >
                  <Activity className="h-8 w-8 mb-2 text-techblue-500" />
                  <span>性能监控</span>
                </TechButton>
              </Link>
              <Link href="/dashboard/api-analytics">
                <TechButton
                  variant="glass"
                  depth="3d"
                  className="w-full h-24 flex flex-col items-center justify-center"
                  animated
                  glow="subtle"
                >
                  <BarChart3 className="h-8 w-8 mb-2 text-techblue-500" />
                  <span>数据分析</span>
                </TechButton>
              </Link>
              <Link href="/dashboard/ai-insights">
                <TechButton
                  variant="glass"
                  depth="3d"
                  className="w-full h-24 flex flex-col items-center justify-center"
                  animated
                  glow="subtle"
                >
                  <Sparkles className="h-8 w-8 mb-2 text-techblue-500" />
                  <span>AI洞察</span>
                </TechButton>
              </Link>
            </div>
          </TechCard>

          <TechCard variant="panel" title="常用工具" description="快速访问系统工具" glow="subtle">
            <div className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/integrations">
                <div className="flex items-center p-3 hover:bg-techblue-50/50 dark:hover:bg-techblue-900/30 rounded-md transition-colors group">
                  <div className="w-10 h-10 rounded-md bg-techblue-100/50 dark:bg-techblue-800/50 flex items-center justify-center mr-3">
                    <Layers className="h-5 w-5 text-techblue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">集成管理</h4>
                    <p className="text-sm text-muted-foreground">管理外部系统集成和连接器</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/alerts">
                <div className="flex items-center p-3 hover:bg-techblue-50/50 dark:hover:bg-techblue-900/30 rounded-md transition-colors group">
                  <div className="w-10 h-10 rounded-md bg-techblue-100/50 dark:bg-techblue-800/50 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-techblue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">告警设置</h4>
                    <p className="text-sm text-muted-foreground">配置系统告警规则和通知渠道</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/export">
                <div className="flex items-center p-3 hover:bg-techblue-50/50 dark:hover:bg-techblue-900/30 rounded-md transition-colors group">
                  <div className="w-10 h-10 rounded-md bg-techblue-100/50 dark:bg-techblue-800/50 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-techblue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">报表导出</h4>
                    <p className="text-sm text-muted-foreground">生成并导出系统数据报表</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            </div>
          </TechCard>
        </div>
      </div>
    </TechLayout>
  )
}

function Bell(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

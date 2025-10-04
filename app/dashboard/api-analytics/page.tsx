import Link from "next/link"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ApiRequestsChart } from "@/components/dashboard/charts/api-requests-chart"
import { ApiResponseTimeChart } from "@/components/dashboard/charts/api-response-time-chart"
import { ApiErrorRateChart } from "@/components/dashboard/charts/api-error-rate-chart"
import { TopApisBarChart } from "@/components/dashboard/charts/top-apis-bar-chart"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ApiDistributionChart } from "@/components/dashboard/charts/api-distribution-chart"
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Download,
  FileText,
  Filter,
  LineChart,
  PieChart,
  RefreshCw,
  Share2,
} from "lucide-react"

export default function ApiAnalyticsPage() {
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
          <h1 className="text-2xl font-bold">API 分析</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">API 流量与性能分析</h2>
            <p className="text-sm text-muted-foreground">全面监控API的使用情况、性能指标及异常状况</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <DateRangePicker />
            <TechButton variant="outline" depth="flat" size="sm" icon={<Filter className="h-4 w-4" />}>
              筛选条件
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              刷新数据
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<Download className="h-4 w-4" />}>
              导出报表
            </TechButton>
          </div>
        </div>

        {/* 核心指标卡片组 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总请求量</p>
                <h3 className="text-2xl font-bold mt-1">248,293</h3>
                <p className="text-xs text-green-600 mt-1">↑ 12.5% vs 上周期</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均响应时间</p>
                <h3 className="text-2xl font-bold mt-1">187ms</h3>
                <p className="text-xs text-green-600 mt-1">↓ 8.3% vs 上周期</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">错误率</p>
                <h3 className="text-2xl font-bold mt-1">1.4%</h3>
                <p className="text-xs text-red-600 mt-1">↑ 0.3% vs 上周期</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <LineChart className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API数量</p>
                <h3 className="text-2xl font-bold mt-1">36</h3>
                <p className="text-xs text-green-600 mt-1">↑ 2 vs 上周期</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-4 bg-techblue-100/50 dark:bg-techblue-800/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              概览
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              请求分析
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              性能分析
            </TabsTrigger>
            <TabsTrigger value="errors" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
              错误分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <TechCard
                variant="panel"
                title="API请求量趋势"
                description="过去30天的API请求量变化趋势"
                glow="subtle"
                action={
                  <TechButton variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </TechButton>
                }
              >
                <div className="h-80">
                  <ApiRequestsChart />
                </div>
              </TechCard>

              <TechCard
                variant="panel"
                title="平均响应时间"
                description="过去30天的API平均响应时间变化趋势"
                glow="subtle"
                action={
                  <TechButton variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </TechButton>
                }
              >
                <div className="h-80">
                  <ApiResponseTimeChart />
                </div>
              </TechCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TechCard
                variant="panel"
                title="API错误率趋势"
                description="过去30天的API错误率变化趋势"
                glow="subtle"
                action={
                  <TechButton variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </TechButton>
                }
              >
                <div className="h-60">
                  <ApiErrorRateChart />
                </div>
              </TechCard>

              <TechCard
                variant="panel"
                title="TOP 5热门API"
                description="请求量最高的5个API端点"
                glow="subtle"
                action={
                  <TechButton variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </TechButton>
                }
              >
                <div className="h-60">
                  <TopApisBarChart />
                </div>
              </TechCard>

              <TechCard
                variant="panel"
                title="API请求分布"
                description="按API类型的请求分布情况"
                glow="subtle"
                action={
                  <TechButton variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </TechButton>
                }
              >
                <div className="h-60">
                  <ApiDistributionChart />
                </div>
              </TechCard>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <TechCard variant="panel" title="详细请求分析" description="API请求量的详细分析数据" glow="subtle">
              <div className="space-y-6">
                <div className="h-96">
                  <ApiRequestsChart detailed />
                </div>

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                    <h3 className="text-sm">热门API端点（按请求量）</h3>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-5 p-3 text-sm font-medium bg-techblue-50/30 dark:bg-techblue-900/30">
                      <div>API端点</div>
                      <div>总请求量</div>
                      <div>成功率</div>
                      <div>平均响应时间</div>
                      <div>趋势</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/users</div>
                      <div>82,947</div>
                      <div>99.8%</div>
                      <div>122ms</div>
                      <div className="text-green-600">↑ 15.3%</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/products</div>
                      <div>65,304</div>
                      <div>99.4%</div>
                      <div>183ms</div>
                      <div className="text-green-600">↑ 8.7%</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/orders</div>
                      <div>42,867</div>
                      <div>97.5%</div>
                      <div>1.2s</div>
                      <div className="text-green-600">↑ 12.1%</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/auth/login</div>
                      <div>38,521</div>
                      <div>98.6%</div>
                      <div>205ms</div>
                      <div className="text-green-600">↑ 5.4%</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/payments</div>
                      <div>18,654</div>
                      <div>85.2%</div>
                      <div>720ms</div>
                      <div className="text-red-600">↓ 3.1%</div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="performance">
            <TechCard variant="panel" title="性能分析详情" description="API性能指标的详细分析数据" glow="subtle">
              <div className="space-y-6">
                <div className="h-96">
                  <ApiResponseTimeChart detailed />
                </div>

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                    <h3 className="text-sm">性能异常API（按响应时间）</h3>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-5 p-3 text-sm font-medium bg-techblue-50/30 dark:bg-techblue-900/30">
                      <div>API端点</div>
                      <div>平均响应时间</div>
                      <div>最慢响应时间</div>
                      <div>阈值</div>
                      <div>状态</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/orders</div>
                      <div>1.2s</div>
                      <div>3.5s</div>
                      <div>500ms</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                          响应缓慢
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/payments</div>
                      <div>720ms</div>
                      <div>2.8s</div>
                      <div>500ms</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                          响应缓慢
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/analytics/reports</div>
                      <div>2.3s</div>
                      <div>4.7s</div>
                      <div>1s</div>
                      <div>
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">严重超时</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/products/search</div>
                      <div>450ms</div>
                      <div>1.2s</div>
                      <div>500ms</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          正常
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="errors">
            <TechCard variant="panel" title="错误分析详情" description="API错误和异常的详细分析数据" glow="subtle">
              <div className="space-y-6">
                <div className="h-96">
                  <ApiErrorRateChart detailed />
                </div>

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                    <h3 className="text-sm">错误最多的API端点</h3>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-5 p-3 text-sm font-medium bg-techblue-50/30 dark:bg-techblue-900/30">
                      <div>API端点</div>
                      <div>错误次数</div>
                      <div>错误率</div>
                      <div>主要错误类型</div>
                      <div>状态</div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/payments</div>
                      <div>2,758</div>
                      <div>14.8%</div>
                      <div>连接超时</div>
                      <div>
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">需要关注</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/orders</div>
                      <div>1,072</div>
                      <div>2.5%</div>
                      <div>数据验证失败</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                          需要监控
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/auth/login</div>
                      <div>539</div>
                      <div>1.4%</div>
                      <div>认证失败</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          正常
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>/api/products</div>
                      <div>392</div>
                      <div>0.6%</div>
                      <div>数据格式错误</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          正常
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-6">
          <TechCard
            variant="panel"
            className="flex-1"
            title="推荐优化措施"
            description="基于数据分析的系统优化建议"
            glow="subtle"
          >
            <div className="space-y-4">
              <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                <div className="flex items-center mb-2">
                  <LineChart className="h-5 w-5 text-yellow-500 mr-2" />
                  <h4 className="font-medium">订单API性能优化</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  订单API的响应时间持续超过阈值。建议优化数据库查询并添加适当的索引，可能会将响应时间减少50%以上。
                </p>
                <div className="mt-3">
                  <Link href="/dashboard/optimization/order-api">
                    <TechButton variant="outline" depth="flat" size="sm">
                      查看详情
                    </TechButton>
                  </Link>
                </div>
              </div>

              <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                <div className="flex items-center mb-2">
                  <PieChart className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="font-medium">支付API错误处理</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  支付API的错误率高达14.8%，主要是连接超时问题。建议检查第三方支付服务连接配置，并实施更强大的重试机制。
                </p>
                <div className="mt-3">
                  <Link href="/dashboard/optimization/payment-api">
                    <TechButton variant="outline" depth="flat" size="sm">
                      查看详情
                    </TechButton>
                  </Link>
                </div>
              </div>

              <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="font-medium">用户API缓存策略</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  用户API的请求量最高，建议实施Redis缓存策略，可以减轻数据库负担并进一步提高响应速度。
                </p>
                <div className="mt-3">
                  <Link href="/dashboard/optimization/user-api">
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
            className="flex-1"
            title="下一步行动计划"
            description="根据分析结果的推荐行动方案"
            glow="subtle"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <span className="font-bold text-yellow-700 dark:text-yellow-300">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">解决支付API错误</h4>
                  <p className="text-sm text-muted-foreground">检查第三方API连接并实施监控告警</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  优先级高
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <span className="font-bold text-yellow-700 dark:text-yellow-300">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">优化订单API性能</h4>
                  <p className="text-sm text-muted-foreground">数据库查询优化和索引添加</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  优先级高
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-techblue-100 dark:bg-techblue-900 flex items-center justify-center">
                  <span className="font-bold text-techblue-700 dark:text-techblue-300">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">为用户API添加缓存</h4>
                  <p className="text-sm text-muted-foreground">实施Redis缓存策略</p>
                </div>
                <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-900 dark:text-techblue-300">
                  优先级中
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-techblue-100 dark:bg-techblue-900 flex items-center justify-center">
                  <span className="font-bold text-techblue-700 dark:text-techblue-300">4</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">性能测试自动化</h4>
                  <p className="text-sm text-muted-foreground">实施自动化性能测试流程</p>
                </div>
                <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-900 dark:text-techblue-300">
                  优先级中
                </Badge>
              </div>
            </div>
          </TechCard>
        </div>
      </div>
    </TechLayout>
  )
}

import Link from "next/link"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApiPerformanceRealtime } from "@/components/dashboard/charts/api-performance-realtime"
import { ApiResourceUsageChart } from "@/components/dashboard/charts/api-resource-usage-chart"
import { ApiEndpointsList } from "@/components/dashboard/api-endpoints-list"
import { PerformanceThresholdSettings } from "@/components/dashboard/performance-threshold-settings"
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  Cpu,
  Download,
  HardDrive,
  RefreshCw,
  Settings,
} from "lucide-react"

export default function PerformanceMonitoringPage() {
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
          <h1 className="text-2xl font-bold">性能监控</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">API 实时性能监控</h2>
            <p className="text-sm text-muted-foreground">实时监控API性能指标及资源使用情况</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择API端点" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有API端点</SelectItem>
                <SelectItem value="users">用户API</SelectItem>
                <SelectItem value="products">产品API</SelectItem>
                <SelectItem value="orders">订单API</SelectItem>
                <SelectItem value="payments">支付API</SelectItem>
              </SelectContent>
            </Select>
            <TechButton variant="outline" depth="flat" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              刷新数据
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<Settings className="h-4 w-4" />}>
              监控设置
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<Bell className="h-4 w-4" />}>
              告警规则
            </TechButton>
          </div>
        </div>

        {/* 实时状态卡片组 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">系统状态</p>
                <h3 className="text-2xl font-bold mt-1">正常</h3>
                <p className="text-xs text-green-600 mt-1">所有服务正常运行</p>
              </div>
              <div className="bg-green-100/50 dark:bg-green-800/50 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">当前响应时间</p>
                <h3 className="text-2xl font-bold mt-1">192ms</h3>
                <p className="text-xs text-green-600 mt-1">✓ 低于阈值(500ms)</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU使用率</p>
                <h3 className="text-2xl font-bold mt-1">42%</h3>
                <p className="text-xs text-green-600 mt-1">✓ 低于阈值(80%)</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <Cpu className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">内存使用率</p>
                <h3 className="text-2xl font-bold mt-1">58%</h3>
                <p className="text-xs text-green-600 mt-1">✓ 低于阈值(90%)</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <HardDrive className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>
        </div>

        <Tabs defaultValue="realtime" className="mb-6">
          <TabsList className="mb-4 bg-techblue-100/50 dark:bg-techblue-800/50">
            <TabsTrigger
              value="realtime"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              实时监控
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              资源使用
            </TabsTrigger>
            <TabsTrigger
              value="endpoints"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              API端点
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              监控设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <TechCard
              variant="panel"
              title="API实时性能监控"
              description="实时监控API响应时间、请求量和错误率"
              glow="subtle"
              action={
                <TechButton variant="outline" depth="flat" size="sm" icon={<Download className="h-4 w-4" />}>
                  导出数据
                </TechButton>
              }
            >
              <div className="h-[400px]">
                <ApiPerformanceRealtime />
              </div>

              <div className="mt-6 border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                  <h3 className="text-sm">实时性能警报</h3>
                </div>
                <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                  <div className="grid grid-cols-4 p-3 text-sm font-medium bg-techblue-50/30 dark:bg-techblue-900/30">
                    <div>时间</div>
                    <div>API端点</div>
                    <div>警报类型</div>
                    <div>状态</div>
                  </div>

                  <div className="grid grid-cols-4 p-3 text-sm">
                    <div>10:15:32</div>
                    <div>/api/payments</div>
                    <div>连接超时</div>
                    <div>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">未解决</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 p-3 text-sm">
                    <div>10:12:18</div>
                    <div>/api/orders</div>
                    <div>响应时间超过阈值</div>
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                        监控中
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 p-3 text-sm">
                    <div>09:57:44</div>
                    <div>/api/analytics/reports</div>
                    <div>内存使用率过高</div>
                    <div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-200">
                        已解决
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="resources">
            <TechCard
              variant="panel"
              title="资源使用监控"
              description="监控系统资源使用情况"
              glow="subtle"
              action={
                <TechButton variant="outline" depth="flat" size="sm" icon={<Download className="h-4 w-4" />}>
                  导出数据
                </TechButton>
              }
            >
              <div className="h-[400px]">
                <ApiResourceUsageChart />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                    <h3 className="text-sm">资源使用趋势</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">CPU使用率 (42%)</span>
                          <span className="text-xs text-green-600">↓ 5% vs 昨天</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-techblue-500 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">内存使用率 (58%)</span>
                          <span className="text-red-600 text-xs">↑ 3% vs 昨天</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-techblue-500 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">磁盘I/O (25%)</span>
                          <span className="text-green-600 text-xs">↓ 2% vs 昨天</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-techblue-500 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">网络使用率 (67%)</span>
                          <span className="text-red-600 text-xs">↑ 8% vs 昨天</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-techblue-500 rounded-full" style={{ width: "67%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                    <h3 className="text-sm">资源消耗最高的API</h3>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-3 p-3 text-sm font-medium bg-techblue-50/30 dark:bg-techblue-900/30">
                      <div>API端点</div>
                      <div>资源类型</div>
                      <div>使用率</div>
                    </div>

                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>/api/analytics/reports</div>
                      <div>内存</div>
                      <div>85%</div>
                    </div>

                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>/api/orders</div>
                      <div>CPU</div>
                      <div>72%</div>
                    </div>

                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>/api/products/search</div>
                      <div>数据库连接</div>
                      <div>68%</div>
                    </div>

                    <div className="grid grid-cols-3 p-3 text-sm">
                      <div>/api/payments</div>
                      <div>网络</div>
                      <div>54%</div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="endpoints">
            <TechCard variant="panel" title="API端点监控" description="各API端点的性能和健康状态监控" glow="subtle">
              <ApiEndpointsList />
            </TechCard>
          </TabsContent>

          <TabsContent value="settings">
            <TechCard variant="panel" title="监控设置" description="配置性能监控阈值和告警规则" glow="subtle">
              <PerformanceThresholdSettings />
            </TechCard>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TechCard
            variant="panel"
            title="最近系统事件"
            description="系统性能相关事件记录"
            glow="subtle"
            footer={
              <Link href="/dashboard/history" className="w-full">
                <TechButton
                  variant="gradient"
                  depth="3d"
                  className="w-full"
                  animated
                  icon={<Activity className="h-4 w-4" />}
                >
                  查看所有事件
                </TechButton>
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">支付API连接超时</p>
                  <p className="text-xs text-muted-foreground">多次尝试连接第三方支付服务失败</p>
                  <p className="text-xs text-muted-foreground">10分钟前</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">订单API响应缓慢</p>
                  <p className="text-xs text-muted-foreground">响应时间超过设定阈值(500ms)</p>
                  <p className="text-xs text-muted-foreground">15分钟前</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">用户API性能优化完成</p>
                  <p className="text-xs text-muted-foreground">响应时间从185ms降至98ms</p>
                  <p className="text-xs text-muted-foreground">1小时前</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">数据库连接池接近上限</p>
                  <p className="text-xs text-muted-foreground">使用率达到85%，接近配置上限</p>
                  <p className="text-xs text-muted-foreground">2小时前</p>
                </div>
              </div>
            </div>
          </TechCard>

          <TechCard
            variant="panel"
            title="性能优化建议"
            description="基于性能数据的系统优化建议"
            glow="subtle"
            footer={
              <Link href="/dashboard/optimization" className="w-full">
                <TechButton
                  variant="gradient"
                  depth="3d"
                  className="w-full"
                  animated
                  icon={<Settings className="h-4 w-4" />}
                >
                  查看所有建议
                </TechButton>
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                <div className="flex items-center mb-2">
                  <Activity className="h-5 w-5 text-yellow-500 mr-2" />
                  <h4 className="font-medium">订单API数据库优化</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  订单API的数据库查询效率较低。建议优化查询语句，添加必要索引，预计可将响应时间降低50%以上。
                </p>
              </div>

              <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                <div className="flex items-center mb-2">
                  <Activity className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="font-medium">支付API连接池配置</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  支付API频繁超时。建议增加连接超时设置，实施断路器模式，防止连锁故障影响整个系统。
                </p>
              </div>

              <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                <div className="flex items-center mb-2">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="font-medium">用户API缓存策略</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  用户API请求量大，但数据变化不频繁。建议实施Redis缓存，可大幅提高性能，减轻数据库负担。
                </p>
              </div>
            </div>
          </TechCard>
        </div>
      </div>
    </TechLayout>
  )
}

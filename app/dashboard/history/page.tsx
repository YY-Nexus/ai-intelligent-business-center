import Link from "next/link"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { ActivityHistoryChart } from "@/components/dashboard/charts/activity-history-chart"
import { ActivityTypeDistribution } from "@/components/dashboard/charts/activity-type-distribution"
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  CheckCircle,
} from "lucide-react"

export default function HistoryPage() {
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
          <h1 className="text-2xl font-bold">操作历史</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">系统操作历史记录</h2>
            <p className="text-sm text-muted-foreground">查看并分析系统历史操作与事件记录</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <DateRangePicker />
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索历史记录..." className="pl-9 w-[200px]" />
            </div>
            <TechButton variant="outline" depth="flat" size="sm" icon={<Filter className="h-4 w-4" />}>
              筛选
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              刷新
            </TechButton>
            <TechButton variant="outline" depth="flat" size="sm" icon={<Download className="h-4 w-4" />}>
              导出
            </TechButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总事件数</p>
                <h3 className="text-2xl font-bold mt-1">3,546</h3>
                <p className="text-xs text-green-600 mt-1">↑ 215 vs 上周期</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">警报事件</p>
                <h3 className="text-2xl font-bold mt-1">48</h3>
                <p className="text-xs text-red-600 mt-1">↑ 12 vs 上周期</p>
              </div>
              <div className="bg-red-100/50 dark:bg-red-800/50 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">配置变更</p>
                <h3 className="text-2xl font-bold mt-1">124</h3>
                <p className="text-xs text-green-600 mt-1">↑ 32 vs 上周期</p>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-2 rounded-lg">
                <SlidersHorizontal className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4 bg-techblue-100/50 dark:bg-techblue-800/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
              所有事件
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
              告警事件
            </TabsTrigger>
            <TabsTrigger value="changes" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
              配置变更
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              统计分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-6">
              <TechCard variant="panel" title="事件历史记录" description="系统所有事件的历史记录" glow="subtle">
                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                    <div>时间</div>
                    <div>事件类型</div>
                    <div>相关组件</div>
                    <div>详情</div>
                    <div>状态</div>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 10:15:32</div>
                      <div>告警</div>
                      <div>支付API</div>
                      <div>支付API连接超时</div>
                      <div>
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">未解决</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 10:12:18</div>
                      <div>告警</div>
                      <div>订单API</div>
                      <div>响应时间超过阈值</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                          监控中
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 09:58:44</div>
                      <div>配置变更</div>
                      <div>订单API</div>
                      <div>数据库查询优化完成</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 09:45:12</div>
                      <div>告警</div>
                      <div>分析API</div>
                      <div>内存使用率过高</div>
                      <div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-200">
                          已解决
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 09:32:37</div>
                      <div>系统事件</div>
                      <div>用户API</div>
                      <div>API版本更新完成</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 09:15:59</div>
                      <div>配置变更</div>
                      <div>系统配置</div>
                      <div>性能监控阈值已更新</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 09:05:22</div>
                      <div>系统事件</div>
                      <div>数据库</div>
                      <div>数据库备份完成</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>2023-05-10 08:45:11</div>
                      <div>用户事件</div>
                      <div>管理员</div>
                      <div>管理员登录成功</div>
                      <div>
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          成功
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">显示 1-8 项，共 3,546 项</p>
                  <div className="flex items-center gap-2">
                    <TechButton variant="outline" size="sm" depth="flat">
                      上一页
                    </TechButton>
                    <span className="text-sm">1/444</span>
                    <TechButton variant="outline" size="sm" depth="flat">
                      下一页
                    </TechButton>
                  </div>
                </div>
              </TechCard>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <TechCard variant="panel" title="告警事件记录" description="系统告警事件的详细历史记录" glow="subtle">
              <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                <div className="grid grid-cols-6 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                  <div>时间</div>
                  <div>告警类型</div>
                  <div>组件</div>
                  <div>严重程度</div>
                  <div>详情</div>
                  <div>状态</div>
                </div>
                <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div>2023-05-10 10:15:32</div>
                    <div>连接超时</div>
                    <div>支付API</div>
                    <div>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">高</Badge>
                    </div>
                    <div>第三方支付服务连接超时</div>
                    <div>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">未解决</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div>2023-05-10 10:12:18</div>
                    <div>性能告警</div>
                    <div>订单API</div>
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                        中
                      </Badge>
                    </div>
                    <div>响应时间连续3次超过阈值</div>
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                        监控中
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div>2023-05-10 09:45:12</div>
                    <div>资源告警</div>
                    <div>分析API</div>
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                        中
                      </Badge>
                    </div>
                    <div>内存使用率超过90%</div>
                    <div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-200">
                        已解决
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div>2023-05-09 22:18:45</div>
                    <div>安���告警</div>
                    <div>认证服务</div>
                    <div>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">高</Badge>
                    </div>
                    <div>多次登录尝试失败</div>
                    <div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-200">
                        已解决
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 p-3 text-sm">
                    <div>2023-05-09 18:32:21</div>
                    <div>可用性告警</div>
                    <div>数据库</div>
                    <div>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">高</Badge>
                    </div>
                    <div>数据库连接池接近耗尽</div>
                    <div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-200">
                        已解决
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">显示 1-5 项，共 48 项</p>
                <div className="flex items-center gap-2">
                  <TechButton variant="outline" size="sm" depth="flat">
                    上一页
                  </TechButton>
                  <span className="text-sm">1/10</span>
                  <TechButton variant="outline" size="sm" depth="flat">
                    下一页
                  </TechButton>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="changes">
            <TechCard variant="panel" title="配置变更记录" description="系统配置变更的历史记录" glow="subtle">
              <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                <div className="grid grid-cols-5 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                  <div>时间</div>
                  <div>变更类型</div>
                  <div>组件</div>
                  <div>变更详情</div>
                  <div>操作者</div>
                </div>
                <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>2023-05-10 09:58:44</div>
                    <div>性能优化</div>
                    <div>订单API</div>
                    <div>优化数据库查询，添加索引</div>
                    <div>admin</div>
                  </div>

                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>2023-05-10 09:15:59</div>
                    <div>阈值设置</div>
                    <div>监控系统</div>
                    <div>更新响应时间阈值(500ms→800ms)</div>
                    <div>admin</div>
                  </div>

                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>2023-05-09 16:42:33</div>
                    <div>API配置</div>
                    <div>用户API</div>
                    <div>添加新端点/api/users/profile</div>
                    <div>developer1</div>
                  </div>

                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>2023-05-09 15:26:18</div>
                    <div>安全配置</div>
                    <div>认证服务</div>
                    <div>更新密码策略要求</div>
                    <div>admin</div>
                  </div>

                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>2023-05-09 14:05:52</div>
                    <div>连接配置</div>
                    <div>支付API</div>
                    <div>更新第三方支付服务连接设置</div>
                    <div>developer2</div>
                  </div>

                  <div className="grid grid-cols-5 p-3 text-sm">
                    <div>2023-05-09 11:32:44</div>
                    <div>资源配置</div>
                    <div>分析API</div>
                    <div>增加内存分配(2GB→4GB)</div>
                    <div>admin</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">显示 1-6 项，共 124 项</p>
                <div className="flex items-center gap-2">
                  <TechButton variant="outline" size="sm" depth="flat">
                    上一页
                  </TechButton>
                  <span className="text-sm">1/21</span>
                  <TechButton variant="outline" size="sm" depth="flat">
                    下一页
                  </TechButton>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <TechCard variant="panel" title="事件历史趋势" description="过去30天的事件数量变化趋势" glow="subtle">
                <div className="h-80">
                  <ActivityHistoryChart />
                </div>
              </TechCard>

              <TechCard variant="panel" title="事件类型分布" description="按类型统计的事件分布情况" glow="subtle">
                <div className="h-80">
                  <ActivityTypeDistribution />
                </div>
              </TechCard>
            </div>

            <TechCard variant="panel" title="关键事件分析" description="系统关键事件的详细分析" glow="subtle">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">支付API连接问题</h4>
                      <p className="text-sm text-muted-foreground">过去7天内发生了12次连接超时</p>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200">需要关注</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">订单API响应时间</h4>
                      <p className="text-sm text-muted-foreground">响应时间呈上升趋势，近7天增加了32%</p>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200">
                      需要监控
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">用户API性能优化</h4>
                      <p className="text-sm text-muted-foreground">性能优化后，响应时间降低了47%</p>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-200">
                      成功案例
                    </Badge>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>
        </Tabs>
      </div>
    </TechLayout>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { ApiUsageChart } from "@/components/api-config/charts/api-usage-chart"
import { ErrorRateChart } from "@/components/api-config/charts/error-rate-chart"
import { ResponseTimeChart } from "@/components/api-config/charts/response-time-chart"
import { TopApisChart } from "@/components/api-config/charts/top-apis-chart"
import { GeographicDistributionChart } from "@/components/api-config/charts/geographic-distribution-chart"
import { HourlyUsageChart } from "@/components/api-config/charts/hourly-usage-chart"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [apiFilter, setApiFilter] = useState("all")
  const [groupBy, setGroupBy] = useState("day")

  // 模拟API列表
  const apiList = [
    { id: "all", name: "所有API" },
    { id: "users", name: "用户API" },
    { id: "products", name: "产品API" },
    { id: "orders", name: "订单API" },
    { id: "payments", name: "支付API" },
    { id: "analytics", name: "分析API" },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">数据分析</h1>
        <p className="text-muted-foreground">深入分析API使用情况、性能指标和错误率，帮助您优化API设计和资源分配。</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>分析筛选器</CardTitle>
          <CardDescription>选择时间范围、API和分组方式</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full" />
            </div>
            <div className="w-full md:w-1/3">
              <Select value={apiFilter} onValueChange={setApiFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="选择API" />
                </SelectTrigger>
                <SelectContent>
                  {apiList.map((api) => (
                    <SelectItem key={api.id} value={api.id}>
                      {api.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="分组方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">按小时</SelectItem>
                  <SelectItem value="day">按天</SelectItem>
                  <SelectItem value="week">按周</SelectItem>
                  <SelectItem value="month">按月</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto">应用筛选器</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">API调用总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl font-bold">1,284,376</div>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-50 text-green-700 border-green-200">+12.5%</Badge>
                <span className="text-sm text-muted-foreground ml-2">较上期</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">平均响应时间</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl font-bold">187ms</div>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-50 text-green-700 border-green-200">-8.3%</Badge>
                <span className="text-sm text-muted-foreground ml-2">较上期</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">错误率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl font-bold">0.42%</div>
              <div className="flex items-center mt-2">
                <Badge className="bg-red-50 text-red-700 border-red-200">+0.1%</Badge>
                <span className="text-sm text-muted-foreground ml-2">较上期</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="usage">使用情况</TabsTrigger>
          <TabsTrigger value="performance">性能</TabsTrigger>
          <TabsTrigger value="errors">错误分析</TabsTrigger>
          <TabsTrigger value="geographic">地理分布</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">API调用趋势</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>过去7天的API调用量趋势</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ApiUsageChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">热门API</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>调用量最高的API端点</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <TopApisChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">响应时间</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>API响应时间趋势</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponseTimeChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">错误率</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>API错误率趋势</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ErrorRateChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">API调用详情</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>按时间段的API调用量</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-96">
                  <ApiUsageChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">按API分类</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>不同API的调用分布</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <TopApisChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">每小时使用情况</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>24小时内的API调用分布</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <HourlyUsageChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">响应时间趋势</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>API响应时间的历史趋势</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-96">
                  <ResponseTimeChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">API性能排名</CardTitle>
                <CardDescription>按响应时间排序的API</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {[
                    { name: "/api/users/profile", time: "85ms", change: "-5%" },
                    { name: "/api/products/list", time: "120ms", change: "-2%" },
                    { name: "/api/orders/status", time: "145ms", change: "+3%" },
                    { name: "/api/analytics/dashboard", time: "210ms", change: "-8%" },
                    { name: "/api/auth/token", time: "65ms", change: "-12%" },
                  ].map((api, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="font-mono text-sm">{api.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>{api.time}</div>
                        <Badge
                          className={
                            api.change.startsWith("-")
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {api.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">性能优化建议</CardTitle>
                <CardDescription>基于性能数据的优化建议</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {[
                    {
                      title: "优化数据库查询",
                      description: "订单API的数据库查询效率较低，建议优化索引和查询语句。",
                      impact: "高",
                    },
                    {
                      title: "实施缓存策略",
                      description: "产品列表API可以实施缓存策略，减少数据库负载。",
                      impact: "中",
                    },
                    {
                      title: "减少响应数据大小",
                      description: "分析仪表板API返回的数据量过大，建议实施分页或减少不必要的字段。",
                      impact: "中",
                    },
                    {
                      title: "优��认证流程",
                      description: "认证API的令牌验证过程可以优化，减少响应时间。",
                      impact: "低",
                    },
                  ].map((suggestion, index) => (
                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <Badge
                          className={
                            suggestion.impact === "高"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : suggestion.impact === "中"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {suggestion.impact}影响
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">错误率趋势</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>API错误率的历史趋势</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-96">
                  <ErrorRateChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">常见错误类型</CardTitle>
                <CardDescription>按频率排序的错误类型</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {[
                    { code: "401", type: "未授权", count: 1245, percentage: "42%" },
                    { code: "404", type: "未找到", count: 876, percentage: "30%" },
                    { code: "400", type: "错误请求", count: 532, percentage: "18%" },
                    { code: "500", type: "服务器错误", count: 187, percentage: "6%" },
                    { code: "429", type: "请求过多", count: 98, percentage: "3%" },
                  ].map((error, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            error.code.startsWith("5")
                              ? "bg-red-50 text-red-700 border-red-200"
                              : error.code.startsWith("4")
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {error.code}
                        </Badge>
                        <div>{error.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">{error.count} 次</div>
                        <div className="w-16 text-right">{error.percentage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">错误最多的API</CardTitle>
                <CardDescription>错误率最高的API端点</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {[
                    { name: "/api/orders/process", rate: "1.2%", change: "+0.3%" },
                    { name: "/api/auth/refresh", rate: "0.9%", change: "-0.1%" },
                    { name: "/api/users/update", rate: "0.7%", change: "+0.2%" },
                    { name: "/api/products/search", rate: "0.5%", change: "-0.2%" },
                    { name: "/api/payments/verify", rate: "0.4%", change: "0%" },
                  ].map((api, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="font-mono text-sm">{api.name}</div>
                      <div className="flex items-center gap-2">
                        <div>{api.rate}</div>
                        <Badge
                          className={
                            api.change.startsWith("+")
                              ? "bg-red-50 text-red-700 border-red-200"
                              : api.change.startsWith("-")
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {api.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">地理分布</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>API调用的地理分布情况</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[500px]">
                  <GeographicDistributionChart />
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">按国家/地区</CardTitle>
                  <CardDescription>API调用量最高的国家/地区</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    {[
                      { name: "中国", count: 523456, percentage: "40.8%" },
                      { name: "美国", count: 215678, percentage: "16.8%" },
                      { name: "日本", count: 124567, percentage: "9.7%" },
                      { name: "韩国", count: 98765, percentage: "7.7%" },
                      { name: "德国", count: 76543, percentage: "6.0%" },
                      { name: "英国", count: 65432, percentage: "5.1%" },
                      { name: "法国", count: 54321, percentage: "4.2%" },
                      { name: "其他", count: 125614, percentage: "9.8%" },
                    ].map((country, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>{country.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">{country.count.toLocaleString()}</div>
                          <div className="w-16 text-right">{country.percentage}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">按城市</CardTitle>
                  <CardDescription>API调用量最高的城市</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    {[
                      { name: "北京", count: 187654, percentage: "14.6%" },
                      { name: "上海", count: 156789, percentage: "12.2%" },
                      { name: "广州", count: 98765, percentage: "7.7%" },
                      { name: "深圳", count: 87654, percentage: "6.8%" },
                      { name: "纽约", count: 76543, percentage: "6.0%" },
                      { name: "东京", count: 65432, percentage: "5.1%" },
                      { name: "首尔", count: 54321, percentage: "4.2%" },
                      { name: "其他", count: 556218, percentage: "43.3%" },
                    ].map((city, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>{city.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">{city.count.toLocaleString()}</div>
                          <div className="w-16 text-right">{city.percentage}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

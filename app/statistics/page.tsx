"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { UsageByProviderChart } from "@/components/usage-by-provider-chart"
import { CostByProviderChart } from "@/components/cost-by-provider-chart"
import { PerformanceMetricsChart } from "@/components/performance-metrics-chart"
import { UsageByEndpointTable } from "@/components/usage-by-endpoint-table"
import { ErrorRateChart } from "@/components/error-rate-chart"
import { useProviders } from "@/hooks/use-providers"
import { useStatistics } from "@/hooks/use-statistics"
import { RefreshCw } from "lucide-react"

export default function StatisticsPage() {
  const { providers } = useProviders()
  const { statistics, fetchStatistics, exportStatistics } = useStatistics()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [groupBy, setGroupBy] = useState("day")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    await fetchStatistics(dateRange, groupBy)
    setIsLoading(false)
  }

  const handleExport = async (format: "csv" | "json" | "excel") => {
    await exportStatistics(dateRange, format)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">使用统计</h1>
            <p className="text-muted-foreground">查看API调用统计、成本分析和性能指标</p>
          </div>
          <div className="flex gap-2">
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="分组方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">按小时</SelectItem>
                <SelectItem value="day">按天</SelectItem>
                <SelectItem value="week">按周</SelectItem>
                <SelectItem value="month">按月</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Select onValueChange={handleExport}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="导出数据" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">导出为CSV</SelectItem>
                <SelectItem value="json">导出为JSON</SelectItem>
                <SelectItem value="excel">导出为Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">日期范围</CardTitle>
              <CardDescription>选择要查看的统计数据时间范围</CardDescription>
            </CardHeader>
            <CardContent>
              <DatePickerWithRange
                date={dateRange}
                setDate={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">总览</CardTitle>
              <CardDescription>所选时间范围内的关键指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">总调用次数</p>
                  <p className="text-2xl font-bold">{statistics.totalCalls.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总成本</p>
                  <p className="text-2xl font-bold">¥{statistics.totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">平均响应时间</p>
                  <p className="text-2xl font-bold">{statistics.avgResponseTime.toFixed(0)}ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">错误率</p>
                  <p className="text-2xl font-bold">{(statistics.errorRate * 100).toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">使用量</TabsTrigger>
            <TabsTrigger value="cost">成本</TabsTrigger>
            <TabsTrigger value="performance">性能</TabsTrigger>
            <TabsTrigger value="endpoints">端点分析</TabsTrigger>
            <TabsTrigger value="errors">错误分析</TabsTrigger>
          </TabsList>
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>按提供商的API调用量</CardTitle>
                <CardDescription>各AI提供商的API调用次数统计</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <UsageByProviderChart data={statistics.usageByProvider} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cost">
            <Card>
              <CardHeader>
                <CardTitle>按提供商的成本分析</CardTitle>
                <CardDescription>各AI提供商的API调用成本统计</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <CostByProviderChart data={statistics.costByProvider} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>性能指标</CardTitle>
                <CardDescription>各AI提供商的响应时间和性能指标</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PerformanceMetricsChart data={statistics.performanceMetrics} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>按端点的使用量</CardTitle>
                <CardDescription>各API端点的调用次数和成本统计</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageByEndpointTable data={statistics.usageByEndpoint} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle>错误率分析</CardTitle>
                <CardDescription>各AI提供商的错误率和错误类型统计</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ErrorRateChart data={statistics.errorRates} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

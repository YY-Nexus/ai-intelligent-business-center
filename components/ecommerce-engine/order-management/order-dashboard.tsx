"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Clock,
  DollarSign,
  LineChart,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Truck,
  AlertCircle,
} from "lucide-react"
import { OrderTrendChart } from "../charts/order-trend-chart"
import { OrderStatusChart } from "../charts/order-status-chart"
import { OrderSourceChart } from "../charts/order-source-chart"

export function OrderDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>订单概览</CardTitle>
              <CardDescription>查看订单数据和关键指标</CardDescription>
            </div>
            <div className="w-full md:w-48">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">今天</SelectItem>
                  <SelectItem value="yesterday">昨天</SelectItem>
                  <SelectItem value="7d">过去7天</SelectItem>
                  <SelectItem value="30d">过去30天</SelectItem>
                  <SelectItem value="90d">过去90天</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">总订单数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">1,248</span>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>12%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一
                  {timeRange === "today"
                    ? "天"
                    : timeRange === "yesterday"
                      ? "天"
                      : timeRange === "7d"
                        ? "周"
                        : timeRange === "30d"
                          ? "月"
                          : "季度"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">总销售额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">¥156,248</span>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>8%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一
                  {timeRange === "today"
                    ? "天"
                    : timeRange === "yesterday"
                      ? "天"
                      : timeRange === "7d"
                        ? "周"
                        : timeRange === "30d"
                          ? "月"
                          : "季度"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">平均订单金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">¥125.20</span>
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span>3%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一
                  {timeRange === "today"
                    ? "天"
                    : timeRange === "yesterday"
                      ? "天"
                      : timeRange === "7d"
                        ? "周"
                        : timeRange === "30d"
                          ? "月"
                          : "季度"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">订单完成率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">94.5%</span>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>1.2%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一
                  {timeRange === "today"
                    ? "天"
                    : timeRange === "yesterday"
                      ? "天"
                      : timeRange === "7d"
                        ? "周"
                        : timeRange === "30d"
                          ? "月"
                          : "季度"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trends">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>订单趋势</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>订单状态</span>
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>订单来源</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>订单趋势</CardTitle>
                  <CardDescription>
                    {timeRange === "today" && "今天"}
                    {timeRange === "yesterday" && "昨天"}
                    {timeRange === "7d" && "过去7天"}
                    {timeRange === "30d" && "过去30天"}
                    {timeRange === "90d" && "过去90天"}
                    的订单和销售额趋势
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTrendChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>订单状态分布</CardTitle>
                  <CardDescription>各状态订单的数量和比例</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderStatusChart />

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Badge className="mb-1 bg-blue-500">待付款</Badge>
                      <span className="text-2xl font-bold">86</span>
                      <span className="text-xs text-muted-foreground">6.9%</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Badge className="mb-1 bg-amber-500">待发货</Badge>
                      <span className="text-2xl font-bold">124</span>
                      <span className="text-xs text-muted-foreground">9.9%</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Badge className="mb-1 bg-purple-500">已发货</Badge>
                      <span className="text-2xl font-bold">215</span>
                      <span className="text-xs text-muted-foreground">17.2%</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Badge className="mb-1 bg-green-500">已完成</Badge>
                      <span className="text-2xl font-bold">782</span>
                      <span className="text-xs text-muted-foreground">62.7%</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Badge className="mb-1 bg-red-500">已取消</Badge>
                      <span className="text-2xl font-bold">41</span>
                      <span className="text-xs text-muted-foreground">3.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources">
              <Card>
                <CardHeader>
                  <CardTitle>订单来源分析</CardTitle>
                  <CardDescription>各平台订单数量和销售额</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderSourceChart />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">淘宝/天猫</CardTitle>
                          <Badge>42.5%</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">订单数:</span>
                            <span className="font-medium">530</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">销售额:</span>
                            <span className="font-medium">¥68,245</span>
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>增长 12%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">抖音小店</CardTitle>
                          <Badge>31.2%</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">订单数:</span>
                            <span className="font-medium">389</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">销售额:</span>
                            <span className="font-medium">¥45,632</span>
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>增长 24%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">自营网站</CardTitle>
                          <Badge>26.3%</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">订单数:</span>
                            <span className="font-medium">329</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">销售额:</span>
                            <span className="font-medium">¥42,371</span>
                          </div>
                          <div className="flex items-center text-sm text-red-600">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            <span>下降 3%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">待处理订单</CardTitle>
            <CardDescription>需要立即处理的订单</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">待发货订单</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">124个订单需要在24小时内发货</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">待确认付款</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">18个订单付款待确认</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300">缺货产品</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">8个订单包含缺货产品</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">物流状态</CardTitle>
            <CardDescription>订单配送状态概览</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">正常配送</p>
                    <p className="text-xs text-muted-foreground">按时送达</p>
                  </div>
                </div>
                <span className="text-xl font-bold">196</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">配送延迟</p>
                    <p className="text-xs text-muted-foreground">预计延迟送达</p>
                  </div>
                </div>
                <span className="text-xl font-bold">12</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">配送异常</p>
                    <p className="text-xs text-muted-foreground">需要处理</p>
                  </div>
                </div>
                <span className="text-xl font-bold">7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">热门产品</CardTitle>
            <CardDescription>销量最高的产品</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <img
                    src="/placeholder.svg?key=93z7p"
                    alt="产品图片"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">超薄笔记本电脑</p>
                  <p className="text-xs text-muted-foreground">销量: 156 | 收入: ¥187,200</p>
                </div>
                <Badge className="bg-green-500">热销</Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <img
                    src="/placeholder.svg?key=7yb1q"
                    alt="产品图片"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">无线蓝牙耳机</p>
                  <p className="text-xs text-muted-foreground">销量: 243 | 收入: ¥36,450</p>
                </div>
                <Badge className="bg-green-500">热销</Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <img
                    src="/placeholder.svg?key=x91o8"
                    alt="产品图片"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">智能手表</p>
                  <p className="text-xs text-muted-foreground">销量: 187 | 收入: ¥56,100</p>
                </div>
                <Badge className="bg-blue-500">新品</Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <img
                    src="/placeholder.svg?key=z7ox0"
                    alt="产品图片"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">便携式充电宝</p>
                  <p className="text-xs text-muted-foreground">销量: 312 | 收入: ¥31,200</p>
                </div>
                <Badge className="bg-green-500">热销</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

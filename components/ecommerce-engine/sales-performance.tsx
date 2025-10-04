"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, BarChart2, LineChart, PieChart, TrendingDown, TrendingUp } from "lucide-react"
import { SalesOverviewChart } from "./charts/sales-overview-chart"
import { ProductCategoryChart } from "./charts/product-category-chart"
import { SalesChannelChart } from "./charts/sales-channel-chart"

export function SalesPerformance() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>销售表现</CardTitle>
              <CardDescription>全面分析销售数据和表现指标</CardDescription>
            </div>
            <div className="w-full md:w-48">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">过去7天</SelectItem>
                  <SelectItem value="30d">过去30天</SelectItem>
                  <SelectItem value="90d">过去90天</SelectItem>
                  <SelectItem value="1y">过去1年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">总销售额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">¥1,245,600</span>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>12%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一{timeRange === "7d" ? "周" : timeRange === "30d" ? "月" : timeRange === "90d" ? "季度" : "年"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">订单数量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">8,562</span>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>8%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一{timeRange === "7d" ? "周" : timeRange === "30d" ? "月" : timeRange === "90d" ? "季度" : "年"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">平均订单金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">¥145.48</span>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>3%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一{timeRange === "7d" ? "周" : timeRange === "30d" ? "月" : timeRange === "90d" ? "季度" : "年"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">转化率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">3.2%</span>
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span>0.5%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  相比上一{timeRange === "7d" ? "周" : timeRange === "30d" ? "月" : timeRange === "90d" ? "季度" : "年"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>销售概览</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>产品分析</span>
              </TabsTrigger>
              <TabsTrigger value="channels" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>渠道分析</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>销售趋势</CardTitle>
                  <CardDescription>
                    {timeRange === "7d" && "过去7天"}
                    {timeRange === "30d" && "过去30天"}
                    {timeRange === "90d" && "过去90天"}
                    {timeRange === "1y" && "过去1年"}
                    的销售趋势
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesOverviewChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>产品类别分析</CardTitle>
                  <CardDescription>各产品类别的销售表现</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductCategoryChart />

                  <Table className="mt-6">
                    <TableHeader>
                      <TableRow>
                        <TableHead>产品类别</TableHead>
                        <TableHead>销售额</TableHead>
                        <TableHead>订单数</TableHead>
                        <TableHead>同比增长</TableHead>
                        <TableHead>利润率</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">笔记本电脑</TableCell>
                        <TableCell>¥458,320</TableCell>
                        <TableCell>1,245</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>15%</span>
                        </TableCell>
                        <TableCell>32%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">智能手机</TableCell>
                        <TableCell>¥325,780</TableCell>
                        <TableCell>2,156</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>8%</span>
                        </TableCell>
                        <TableCell>28%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">平板电脑</TableCell>
                        <TableCell>¥215,450</TableCell>
                        <TableCell>1,023</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                          <span>3%</span>
                        </TableCell>
                        <TableCell>30%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">智能手表</TableCell>
                        <TableCell>¥156,780</TableCell>
                        <TableCell>2,345</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>22%</span>
                        </TableCell>
                        <TableCell>35%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">配件</TableCell>
                        <TableCell>¥89,270</TableCell>
                        <TableCell>1,793</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>12%</span>
                        </TableCell>
                        <TableCell>45%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels">
              <Card>
                <CardHeader>
                  <CardTitle>销售渠道分析</CardTitle>
                  <CardDescription>各销售渠道的表现对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChannelChart />

                  <Table className="mt-6">
                    <TableHeader>
                      <TableRow>
                        <TableHead>销售渠道</TableHead>
                        <TableHead>销售额</TableHead>
                        <TableHead>占比</TableHead>
                        <TableHead>同比增长</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">自营网站</TableCell>
                        <TableCell>¥458,320</TableCell>
                        <TableCell>36.8%</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>18%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">增长</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">天猫旗舰店</TableCell>
                        <TableCell>¥325,780</TableCell>
                        <TableCell>26.2%</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>12%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">增长</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">京东旗舰店</TableCell>
                        <TableCell>¥215,450</TableCell>
                        <TableCell>17.3%</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>5%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500">稳定</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">线下门店</TableCell>
                        <TableCell>¥156,780</TableCell>
                        <TableCell>12.6%</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                          <span>8%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-500">下降</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">其他渠道</TableCell>
                        <TableCell>¥89,270</TableCell>
                        <TableCell>7.1%</TableCell>
                        <TableCell className="flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span>15%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">增长</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

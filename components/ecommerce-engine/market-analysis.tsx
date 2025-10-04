"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { MarketTrendChart } from "./charts/market-trend-chart"
import { CategoryDistributionChart } from "./charts/category-distribution-chart"
import { CompetitorShareChart } from "./charts/competitor-share-chart"

export function MarketAnalysis() {
  const [analysisType, setAnalysisType] = useState("market-trends")
  const [timeRange, setTimeRange] = useState("30d")
  const [category, setCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = () => {
    setIsLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>市场分析</CardTitle>
          <CardDescription>分析电商市场趋势、类别分布和竞争格局，帮助您做出明智的业务决策</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">分析类型</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分析类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market-trends">市场趋势</SelectItem>
                  <SelectItem value="category-distribution">类别分布</SelectItem>
                  <SelectItem value="competitor-analysis">竞争分析</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">时间范围</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">产品类别</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="选择产品类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类别</SelectItem>
                  <SelectItem value="electronics">电子产品</SelectItem>
                  <SelectItem value="fashion">时尚服饰</SelectItem>
                  <SelectItem value="home">家居用品</SelectItem>
                  <SelectItem value="beauty">美妆护肤</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? "分析中..." : "开始分析"}
            </Button>
          </div>

          <Tabs value={analysisType} onValueChange={setAnalysisType}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="market-trends" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>市场趋势</span>
              </TabsTrigger>
              <TabsTrigger value="category-distribution" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>类别分布</span>
              </TabsTrigger>
              <TabsTrigger value="competitor-analysis" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>竞争分析</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="market-trends">
              <Card>
                <CardHeader>
                  <CardTitle>市场趋势分析</CardTitle>
                  <CardDescription>
                    {timeRange === "7d" && "过去7天"}
                    {timeRange === "30d" && "过去30天"}
                    {timeRange === "90d" && "过去90天"}
                    {timeRange === "1y" && "过去1年"}
                    的市场趋势数据
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarketTrendChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category-distribution">
              <Card>
                <CardHeader>
                  <CardTitle>类别分布分析</CardTitle>
                  <CardDescription>
                    {timeRange === "7d" && "过去7天"}
                    {timeRange === "30d" && "过去30天"}
                    {timeRange === "90d" && "过去90天"}
                    {timeRange === "1y" && "过去1年"}
                    的类别分布数据
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryDistributionChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitor-analysis">
              <Card>
                <CardHeader>
                  <CardTitle>竞争分析</CardTitle>
                  <CardDescription>
                    {timeRange === "7d" && "过去7天"}
                    {timeRange === "30d" && "过去30天"}
                    {timeRange === "90d" && "过去90天"}
                    {timeRange === "1y" && "过去1年"}
                    的竞争对手市场份额数据
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompetitorShareChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>市场洞察</CardTitle>
          <CardDescription>基于数据分析的市场洞察和建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">市场趋势洞察</h3>
              <p className="text-blue-700 dark:text-blue-400">
                根据最近的数据分析，电子产品类别在过去30天内增长了15%，这表明消费者对科技产品的需求正在上升。建议增加电子产品的库存和营销投入。
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">机会识别</h3>
              <p className="text-green-700 dark:text-green-400">
                家居用品类别的搜索量增加了20%，但转化率仅为3.5%，低于平均水平。这表明存在提高产品展示和优化产品描述的机会，以提高转化率。
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">竞争警报</h3>
              <p className="text-amber-700 dark:text-amber-400">
                竞争对手A在美妆护肤类别的市场份额增加了5%，主要通过降价和增加促销活动。建议密切关注并考虑调整定价策略或增加促销力度。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

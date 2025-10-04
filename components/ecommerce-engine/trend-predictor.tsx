"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, BarChart2, Calendar, LineChart, TrendingUp } from "lucide-react"
import { TrendForecastChart } from "./charts/trend-forecast-chart"
import { SeasonalityChart } from "./charts/seasonality-chart"

export function TrendPredictor() {
  const [category, setCategory] = useState("electronics")
  const [timeRange, setTimeRange] = useState("6m")
  const [isLoading, setIsLoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [activeTab, setActiveTab] = useState("forecast")

  const handlePredict = () => {
    setIsLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false)
      setHasResults(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>趋势预测</CardTitle>
          <CardDescription>基于历史数据和市场信息预测未来趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">产品类别</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择产品类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">电子产品</SelectItem>
                    <SelectItem value="fashion">时尚服饰</SelectItem>
                    <SelectItem value="home">家居用品</SelectItem>
                    <SelectItem value="beauty">美妆护肤</SelectItem>
                    <SelectItem value="sports">运动户外</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">预测时间范围</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">未来1个月</SelectItem>
                    <SelectItem value="3m">未来3个月</SelectItem>
                    <SelectItem value="6m">未来6个月</SelectItem>
                    <SelectItem value="1y">未来1年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handlePredict} disabled={isLoading} className="w-full">
                  {isLoading ? "预测中..." : "开始预测"}
                  <TrendingUp className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {hasResults && (
              <div className="mt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="forecast" className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      <span>销售预测</span>
                    </TabsTrigger>
                    <TabsTrigger value="seasonality" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>季节性分析</span>
                    </TabsTrigger>
                    <TabsTrigger value="emerging" className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>新兴趋势</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="forecast">
                    <Card>
                      <CardHeader>
                        <CardTitle>销售预测</CardTitle>
                        <CardDescription>
                          {timeRange === "1m" && "未来1个月"}
                          {timeRange === "3m" && "未来3个月"}
                          {timeRange === "6m" && "未来6个月"}
                          {timeRange === "1y" && "未来1年"}
                          的销售趋势预测
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TrendForecastChart />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">预测增长率</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">+15.3%</span>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">相比去年同期增长15.3%</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">预测销售额</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">¥1,245,600</span>
                                <BarChart2 className="h-8 w-8 text-blue-500" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                {timeRange === "1m" && "未来1个月"}
                                {timeRange === "3m" && "未来3个月"}
                                {timeRange === "6m" && "未来6个月"}
                                {timeRange === "1y" && "未来1年"}
                                的预计总销售额
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">预测准确率</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">87%</span>
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                  <span className="text-sm font-medium">高</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">基于历史预测准确率评估</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="seasonality">
                    <Card>
                      <CardHeader>
                        <CardTitle>季节性分析</CardTitle>
                        <CardDescription>产品类别的季节性销售模式分析</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SeasonalityChart />

                        <div className="space-y-4 mt-6">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">季节性洞察</h3>
                            <p className="text-blue-700 dark:text-blue-400">
                              电子产品类别在每年的第四季度（10月-12月）销售额最高，比平均水平高出约35%。这主要是由于年末假期购物季的影响。建议在这段时间增加库存和营销投入。
                            </p>
                          </div>

                          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">淡季策略</h3>
                            <p className="text-green-700 dark:text-green-400">
                              第一季度（1月-3月）通常是电子产品的销售淡季，销售额比平均水平低约20%。建议在这段时间推出促销活动或捆绑销售，以刺激需求。
                            </p>
                          </div>

                          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">特殊时段</h3>
                            <p className="text-amber-700 dark:text-amber-400">
                              除了季节性趋势外，还有一些特殊时段会影响销售，如开学季（8月-9月）和各种电商促销节日（如618、双11）。这些时段的销售额可能会比平常高出50%以上。
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="emerging">
                    <Card>
                      <CardHeader>
                        <CardTitle>新兴趋势</CardTitle>
                        <CardDescription>识别市场中的新兴趋势和机会</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">AI智能设备</CardTitle>
                                  <Badge className="bg-red-500">热门趋势</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                  搜索量增长: <span className="font-medium text-foreground">+125%</span>
                                </p>
                                <p className="text-sm mb-4">
                                  具有AI功能的智能设备需求激增，特别是智能家居助手和AI驱动的笔记本电脑。消费者越来越重视设备的智能化和个性化体验。
                                </p>
                                <Button variant="outline" size="sm">
                                  查看详情
                                </Button>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">可持续电子产品</CardTitle>
                                  <Badge className="bg-amber-500">增长趋势</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                  搜索量增长: <span className="font-medium text-foreground">+78%</span>
                                </p>
                                <p className="text-sm mb-4">
                                  环保材料制造的电子产品和能源效率高的设备越来越受欢迎。消费者更关注产品的环保性能和企业的可持续发展承诺。
                                </p>
                                <Button variant="outline" size="sm">
                                  查看详情
                                </Button>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">折叠屏设备</CardTitle>
                                  <Badge className="bg-blue-500">新兴趋势</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                  搜索量增长: <span className="font-medium text-foreground">+62%</span>
                                </p>
                                <p className="text-sm mb-4">
                                  折叠屏手机和笔记本电脑的需求正在增长，消费者对创新形态的设备表现出浓厚兴趣。随着技术成熟和价格下降，这一趋势预计将加速。
                                </p>
                                <Button variant="outline" size="sm">
                                  查看详情
                                </Button>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">健康监测设备</CardTitle>
                                  <Badge className="bg-green-500">稳定趋势</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                  搜索量增长: <span className="font-medium text-foreground">+45%</span>
                                </p>
                                <p className="text-sm mb-4">
                                  智能手表和健康监测设备持续受到欢迎，特别是具有高级健康监测功能（如血氧、心电图等）的产品。消费者越来越重视健康管理。
                                </p>
                                <Button variant="outline" size="sm">
                                  查看详情
                                </Button>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">趋势洞察</h3>
                            <p className="text-blue-700 dark:text-blue-400">
                              根据当前趋势分析，AI功能将成为未来电子产品的标配，而不是加分项。建议在产品线中增加AI功能，并在营销中强调这些功能如何提升用户体验。同时，可持续发展也是一个不容忽视的趋势，考虑在产品设计和包装中融入环保元素。
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

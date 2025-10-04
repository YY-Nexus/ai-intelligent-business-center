"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowDown, ArrowUp, Eye, LineChart, Search, Star, Zap } from "lucide-react"
import { CompetitorPriceChart } from "./charts/competitor-price-chart"

export function CompetitorTracker() {
  const [productId, setProductId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [activeTab, setActiveTab] = useState("price")

  const handleTrack = () => {
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
          <CardTitle>竞争对手追踪</CardTitle>
          <CardDescription>监控竞争对手的价格、产品和营销策略</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-id">产品ID或关键词</Label>
              <div className="flex gap-2">
                <Input
                  id="product-id"
                  placeholder="输入产品ID或关键词"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
                <Button onClick={handleTrack} disabled={isLoading}>
                  {isLoading ? "分析中..." : "开始追踪"}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {hasResults && (
              <div className="mt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="price" className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      <span>价格追踪</span>
                    </TabsTrigger>
                    <TabsTrigger value="products" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>产品对比</span>
                    </TabsTrigger>
                    <TabsTrigger value="marketing" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>营销策略</span>
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>竞争预警</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="price">
                    <Card>
                      <CardHeader>
                        <CardTitle>价格追踪</CardTitle>
                        <CardDescription>监控竞争对手的价格变化</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <CompetitorPriceChart />

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>竞争对手</TableHead>
                                <TableHead>当前价格</TableHead>
                                <TableHead>7天变化</TableHead>
                                <TableHead>30天变化</TableHead>
                                <TableHead>相对我们</TableHead>
                                <TableHead>操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">竞争对手A</TableCell>
                                <TableCell>¥329.99</TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                                  <span>-5%</span>
                                </TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                                  <span>-8%</span>
                                </TableCell>
                                <TableCell>+10%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">竞争对手B</TableCell>
                                <TableCell>¥289.99</TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                                  <span>+2%</span>
                                </TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                                  <span>-3%</span>
                                </TableCell>
                                <TableCell>-3%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">竞争对手C</TableCell>
                                <TableCell>¥349.99</TableCell>
                                <TableCell className="flex items-center">
                                  <span>0%</span>
                                </TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                                  <span>+5%</span>
                                </TableCell>
                                <TableCell>+17%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">竞争对手D</TableCell>
                                <TableCell>¥279.99</TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                                  <span>-10%</span>
                                </TableCell>
                                <TableCell className="flex items-center">
                                  <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                                  <span>-15%</span>
                                </TableCell>
                                <TableCell>-7%</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="products">
                    <Card>
                      <CardHeader>
                        <CardTitle>产品对比</CardTitle>
                        <CardDescription>与竞争对手的产品特性和评价对比</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>特性</TableHead>
                              <TableHead>我们的产品</TableHead>
                              <TableHead>竞争对手A</TableHead>
                              <TableHead>竞争对手B</TableHead>
                              <TableHead>竞争对手C</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">处理器</TableCell>
                              <TableCell>Intel i7 第12代</TableCell>
                              <TableCell>Intel i5 第12代</TableCell>
                              <TableCell>Intel i7 第11代</TableCell>
                              <TableCell>AMD Ryzen 7</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">内存</TableCell>
                              <TableCell>16GB DDR4</TableCell>
                              <TableCell>8GB DDR4</TableCell>
                              <TableCell>16GB DDR4</TableCell>
                              <TableCell>16GB DDR4</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">存储</TableCell>
                              <TableCell>512GB SSD</TableCell>
                              <TableCell>512GB SSD</TableCell>
                              <TableCell>256GB SSD</TableCell>
                              <TableCell>1TB SSD</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">电池续航</TableCell>
                              <TableCell>12小时</TableCell>
                              <TableCell>10小时</TableCell>
                              <TableCell>8小时</TableCell>
                              <TableCell>14小时</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">重量</TableCell>
                              <TableCell>1.4kg</TableCell>
                              <TableCell>1.6kg</TableCell>
                              <TableCell>1.3kg</TableCell>
                              <TableCell>1.5kg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">评分</TableCell>
                              <TableCell>4.5/5</TableCell>
                              <TableCell>4.2/5</TableCell>
                              <TableCell>4.0/5</TableCell>
                              <TableCell>4.7/5</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">价格</TableCell>
                              <TableCell>¥299.99</TableCell>
                              <TableCell>¥329.99</TableCell>
                              <TableCell>¥289.99</TableCell>
                              <TableCell>¥349.99</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="marketing">
                    <Card>
                      <CardHeader>
                        <CardTitle>营销策略</CardTitle>
                        <CardDescription>竞争对手的促销和营销活动</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">竞争对手A</CardTitle>
                                  <Badge>活跃促销</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>限时折扣：全场8.5折，还剩3天</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>赠品：购买笔记本送无线鼠标</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>社交媒体：增加了Instagram广告投放</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">竞争对手B</CardTitle>
                                  <Badge variant="outline">无活跃促销</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-muted-foreground">上次促销：买二送一（已结束）</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-muted-foreground">内容营销：发布了新的产品使用教程</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">竞争对手C</CardTitle>
                                  <Badge>活跃促销</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>会员专享：会员额外9折</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>免息分期：最高12期免息</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>KOL合作：与3位科技博主合作推广</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">竞争对手D</CardTitle>
                                  <Badge>活跃促销</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>闪购活动：每日限时特价</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>捆绑销售：笔记本+配件��装优惠</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>搜索广告：增加了Google和百度的广告投放</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="alerts">
                    <Card>
                      <CardHeader>
                        <CardTitle>竞争预警</CardTitle>
                        <CardDescription>重要的竞争对手动态和市场变化预警</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">高优先级预警</h3>
                            <p className="text-red-700 dark:text-red-400 mb-2">
                              竞争对手D在过去7天内将价格降低了10%，现在比我们的产品便宜7%。这可能会影响我们的销量。
                            </p>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                查看详情
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">
                              中优先级预警
                            </h3>
                            <p className="text-amber-700 dark:text-amber-400 mb-2">
                              竞争对手A推出了新的促销活动，全场8.5折，并赠送无线鼠标。这可能会吸引部分潜在客户。
                            </p>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                              >
                                查看详情
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">市场趋势预警</h3>
                            <p className="text-blue-700 dark:text-blue-400 mb-2">
                              市场上AMD处理器的笔记本电脑需求增加了15%。我们的产品线主要基于Intel处理器，可能需要考虑增加AMD产品。
                            </p>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              >
                                查看详情
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">机会预警</h3>
                            <p className="text-green-700 dark:text-green-400 mb-2">
                              竞争对手B的产品评分下降了0.3分，主要是因为客户服务问题。这是提高我们客户服务质量并强调这一优势的好机会。
                            </p>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                              >
                                查看详情
                              </Button>
                            </div>
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

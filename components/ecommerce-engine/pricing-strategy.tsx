"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Calculator, DollarSign, LineChart, TrendingUp } from "lucide-react"
import { PricingSimulationChart } from "./charts/pricing-simulation-chart"

export function PricingStrategy() {
  const [productId, setProductId] = useState("")
  const [currentPrice, setCurrentPrice] = useState("299.99")
  const [costPrice, setCostPrice] = useState("180.00")
  const [competitorPrice, setCompetitorPrice] = useState("329.99")
  const [pricingStrategy, setPricingStrategy] = useState("profit-maximization")
  const [marginTarget, setMarginTarget] = useState([40])
  const [isCompetitive, setIsCompetitive] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // 模拟API调用
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasResults(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>定价策略</CardTitle>
          <CardDescription>基于成本、竞争和市场需求制定最佳定价策略</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-id">产品ID</Label>
                <Input
                  id="product-id"
                  placeholder="输入产品ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-price">当前售价</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current-price"
                      className="pl-8"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost-price">成本价</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cost-price"
                      className="pl-8"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitor-price">主要竞争对手价格</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="competitor-price"
                    className="pl-8"
                    value={competitorPrice}
                    onChange={(e) => setCompetitorPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing-strategy">定价策略</Label>
                <Select value={pricingStrategy} onValueChange={setPricingStrategy}>
                  <SelectTrigger id="pricing-strategy">
                    <SelectValue placeholder="选择定价策略" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit-maximization">利润最大化</SelectItem>
                    <SelectItem value="market-share">市场份额扩张</SelectItem>
                    <SelectItem value="premium">高端定价</SelectItem>
                    <SelectItem value="economy">经济实惠定价</SelectItem>
                    <SelectItem value="psychological">心理定价</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>目标利润率</Label>
                  <span className="text-sm text-muted-foreground">{marginTarget}%</span>
                </div>
                <Slider value={marginTarget} onValueChange={setMarginTarget} max={80} step={1} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="competitive-pricing" checked={isCompetitive} onCheckedChange={setIsCompetitive} />
                <Label htmlFor="competitive-pricing">考虑竞争对手价格</Label>
              </div>

              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? "分析中..." : "计算最佳定价"}
                <Calculator className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {hasResults ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">定价建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">建议售价</span>
                        <span className="text-2xl font-bold">¥289.99</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">预计利润率</span>
                        <div className="flex items-center">
                          <span className="font-medium">38%</span>
                          <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">预计销量变化</span>
                        <div className="flex items-center">
                          <span className="font-medium">+12%</span>
                          <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">相对竞争对手</span>
                        <div className="flex items-center">
                          <span className="font-medium">-12%</span>
                          <ArrowDown className="ml-1 h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">价格敏感度分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PricingSimulationChart />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">输入产品信息并点击"计算最佳定价"查看定价建议</p>
                </div>
              </div>
            )}
          </div>

          {hasResults && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>价格方案比较</CardTitle>
                  <CardDescription>不同定价策略的预期结果比较</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>定价策略</TableHead>
                        <TableHead>建议价格</TableHead>
                        <TableHead>预计利润率</TableHead>
                        <TableHead>预计销量变化</TableHead>
                        <TableHead>预计总利润变化</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">利润最大化</TableCell>
                        <TableCell>¥289.99</TableCell>
                        <TableCell>38%</TableCell>
                        <TableCell>+12%</TableCell>
                        <TableCell className="text-green-600">+18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">市场份额扩张</TableCell>
                        <TableCell>¥259.99</TableCell>
                        <TableCell>31%</TableCell>
                        <TableCell>+25%</TableCell>
                        <TableCell className="text-green-600">+15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">高端定价</TableCell>
                        <TableCell>¥349.99</TableCell>
                        <TableCell>48%</TableCell>
                        <TableCell>-15%</TableCell>
                        <TableCell className="text-red-600">-5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">经济实惠定价</TableCell>
                        <TableCell>¥239.99</TableCell>
                        <TableCell>25%</TableCell>
                        <TableCell>+35%</TableCell>
                        <TableCell className="text-green-600">+10%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">心理定价</TableCell>
                        <TableCell>¥299.99</TableCell>
                        <TableCell>40%</TableCell>
                        <TableCell>+8%</TableCell>
                        <TableCell className="text-green-600">+12%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

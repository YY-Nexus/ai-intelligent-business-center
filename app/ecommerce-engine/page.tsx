"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketAnalysis } from "@/components/ecommerce-engine/market-analysis"
import { ProductOptimizer } from "@/components/ecommerce-engine/product-optimizer"
import { PricingStrategy } from "@/components/ecommerce-engine/pricing-strategy"
import { CompetitorTracker } from "@/components/ecommerce-engine/competitor-tracker"
import { TrendPredictor } from "@/components/ecommerce-engine/trend-predictor"
import { SalesPerformance } from "@/components/ecommerce-engine/sales-performance"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Search, DollarSign } from "lucide-react"
// 导入导航链接组件
import { EcommerceNavigationLinks } from "@/components/ecommerce-engine/navigation-links"

export default function EcommerceEnginePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("market-analysis")

  // 从URL获取当前tab
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // 切换tab时更新URL
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/ecommerce-engine?tab=${value}`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">电商引擎</h1>
        <p className="text-muted-foreground">
          全面的电商数据分析和优化工具，帮助您了解市场趋势、优化产品、制定定价策略、追踪竞争对手、预测趋势和分析销售表现。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">市场分析</h3>
              <p className="text-sm text-muted-foreground mt-1">分析市场趋势和消费者行为</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">产品优化</h3>
              <p className="text-sm text-muted-foreground mt-1">优化产品信息和展示效果</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">定价策略</h3>
              <p className="text-sm text-muted-foreground mt-1">制定最优定价策略提高利润</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="market-analysis">市场分析</TabsTrigger>
              <TabsTrigger value="product-optimizer">产品优化</TabsTrigger>
              <TabsTrigger value="pricing-strategy">定价策略</TabsTrigger>
              <TabsTrigger value="competitor-tracker">竞争追踪</TabsTrigger>
              <TabsTrigger value="trend-predictor">趋势预测</TabsTrigger>
              <TabsTrigger value="sales-performance">销售表现</TabsTrigger>
            </TabsList>

            <TabsContent value="market-analysis">
              <MarketAnalysis />
            </TabsContent>

            <TabsContent value="product-optimizer">
              <ProductOptimizer />
            </TabsContent>

            <TabsContent value="pricing-strategy">
              <PricingStrategy />
            </TabsContent>

            <TabsContent value="competitor-tracker">
              <CompetitorTracker />
            </TabsContent>

            <TabsContent value="trend-predictor">
              <TrendPredictor />
            </TabsContent>

            <TabsContent value="sales-performance">
              <SalesPerformance />
            </TabsContent>
          </Tabs>

          <div className="hidden md:flex ml-4">
            <EcommerceNavigationLinks />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <EcommerceNavigationLinks />
      </div>
    </div>
  )
}

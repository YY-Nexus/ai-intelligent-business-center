"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderDashboard } from "@/components/ecommerce-engine/order-management/order-dashboard"
import { OrderList } from "@/components/ecommerce-engine/order-management/order-list"
import { ProductRecommendation } from "@/components/ecommerce-engine/order-management/product-recommendation"
import { LogisticsTracking } from "@/components/ecommerce-engine/order-management/logistics-tracking"
import { SupplierNotification } from "@/components/ecommerce-engine/order-management/supplier-notification"

export default function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">智能订单管理</h1>
        <p className="text-muted-foreground">全面管理订单流程，自动产品推荐，供应商通知和物流跟踪</p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="dashboard">订单概览</TabsTrigger>
          <TabsTrigger value="orders">订单列表</TabsTrigger>
          <TabsTrigger value="recommendations">产品推荐</TabsTrigger>
          <TabsTrigger value="logistics">物流跟踪</TabsTrigger>
          <TabsTrigger value="suppliers">供应商通知</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <OrderDashboard />
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          <OrderList />
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
          <ProductRecommendation />
        </TabsContent>
        <TabsContent value="logistics" className="mt-6">
          <LogisticsTracking />
        </TabsContent>
        <TabsContent value="suppliers" className="mt-6">
          <SupplierNotification />
        </TabsContent>
      </Tabs>
    </div>
  )
}

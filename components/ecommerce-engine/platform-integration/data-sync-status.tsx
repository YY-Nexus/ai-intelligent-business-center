"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  Truck,
  Users,
} from "lucide-react"

interface SyncStatusCardProps {
  title: string
  icon: React.ReactNode
  total: number
  synced: number
  lastSync: string
  status: "success" | "warning" | "error" | "syncing"
  onSync: () => void
}

function SyncStatusCard({ title, icon, total, synced, lastSync, status, onSync }: SyncStatusCardProps) {
  const progress = Math.round((synced / total) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge
            variant={
              status === "success"
                ? "success"
                : status === "warning"
                  ? "warning"
                  : status === "error"
                    ? "destructive"
                    : "outline"
            }
          >
            {status === "success"
              ? "已同步"
              : status === "warning"
                ? "部分同步"
                : status === "error"
                  ? "同步失败"
                  : "同步中"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>同步进度</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              已同步: {synced}/{total}
            </span>
            <span>上次同步: {lastSync}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 flex items-center justify-center gap-1"
            onClick={onSync}
            disabled={status === "syncing"}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{status === "syncing" ? "同步中..." : "立即同步"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface SyncActivityProps {
  time: string
  platform: string
  action: string
  status: "success" | "warning" | "error"
  details: string
}

function SyncActivity({ time, platform, action, status, details }: SyncActivityProps) {
  return (
    <div className="flex gap-3 py-3">
      <div className="flex-shrink-0 mt-1">
        {status === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : status === "warning" ? (
          <AlertCircle className="h-5 w-5 text-amber-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <p className="text-sm font-medium">{action}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground">{platform}</p>
        <p className="text-xs">{details}</p>
      </div>
    </div>
  )
}

export function DataSyncStatus() {
  const [syncData, setSyncData] = useState({
    products: { total: 1245, synced: 1245, lastSync: "2023-05-14 14:30:22", status: "success" as const },
    orders: { total: 856, synced: 856, lastSync: "2023-05-14 14:30:22", status: "success" as const },
    inventory: { total: 1245, synced: 1187, lastSync: "2023-05-14 14:30:22", status: "warning" as const },
    customers: { total: 3254, synced: 3254, lastSync: "2023-05-14 14:30:22", status: "success" as const },
    reviews: { total: 2156, synced: 1893, lastSync: "2023-05-14 14:30:22", status: "warning" as const },
  })

  const handleSync = (type: keyof typeof syncData) => {
    // 更新为同步中状态
    setSyncData({
      ...syncData,
      [type]: { ...syncData[type], status: "syncing" as const },
    })

    // 模拟同步完成
    setTimeout(() => {
      setSyncData({
        ...syncData,
        [type]: {
          ...syncData[type],
          synced: syncData[type].total,
          lastSync: new Date().toLocaleString(),
          status: "success" as const,
        },
      })
    }, 2000)
  }

  const [activities] = useState<SyncActivityProps[]>([
    {
      time: "14:30:22",
      platform: "淘宝/天猫",
      action: "产品数据同步",
      status: "success",
      details: "成功同步1245个产品",
    },
    {
      time: "14:30:20",
      platform: "淘宝/天猫",
      action: "订单数据同步",
      status: "success",
      details: "成功同步856个订单",
    },
    {
      time: "14:30:18",
      platform: "淘宝/天猫",
      action: "库存数据同步",
      status: "warning",
      details: "部分同步成功，58个SKU同步失败",
    },
    {
      time: "14:30:15",
      platform: "抖音小店",
      action: "产品数据同步",
      status: "success",
      details: "成功同步432个产品",
    },
    {
      time: "14:30:12",
      platform: "抖音小店",
      action: "订单数据同步",
      status: "success",
      details: "成功同步215个订单",
    },
    {
      time: "14:30:10",
      platform: "抖音小店",
      action: "评价数据同步",
      status: "warning",
      details: "部分同步成功，263个评价同步失败",
    },
    {
      time: "10:15:36",
      platform: "淘宝/天猫",
      action: "客户数据同步",
      status: "success",
      details: "成功同步3254个客户",
    },
    {
      time: "10:15:30",
      platform: "抖音小店",
      action: "库存数据同步",
      status: "error",
      details: "同步失败，API请求超时",
    },
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>数据同步状态</CardTitle>
          <CardDescription>查看各类数据的同步状态和历史记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-800 dark:text-blue-300">上次完整同步</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">2023年5月14日 14:30:22 (约5小时前)</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>全部同步</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <SyncStatusCard
              title="产品数据"
              icon={<Package className="h-4 w-4 text-primary" />}
              total={syncData.products.total}
              synced={syncData.products.synced}
              lastSync={syncData.products.lastSync}
              status={syncData.products.status}
              onSync={() => handleSync("products")}
            />
            <SyncStatusCard
              title="订单数据"
              icon={<ShoppingCart className="h-4 w-4 text-primary" />}
              total={syncData.orders.total}
              synced={syncData.orders.synced}
              lastSync={syncData.orders.lastSync}
              status={syncData.orders.status}
              onSync={() => handleSync("orders")}
            />
            <SyncStatusCard
              title="库存数据"
              icon={<ArrowDownToLine className="h-4 w-4 text-primary" />}
              total={syncData.inventory.total}
              synced={syncData.inventory.synced}
              lastSync={syncData.inventory.lastSync}
              status={syncData.inventory.status}
              onSync={() => handleSync("inventory")}
            />
            <SyncStatusCard
              title="客户数据"
              icon={<Users className="h-4 w-4 text-primary" />}
              total={syncData.customers.total}
              synced={syncData.customers.synced}
              lastSync={syncData.customers.lastSync}
              status={syncData.customers.status}
              onSync={() => handleSync("customers")}
            />
            <SyncStatusCard
              title="评价数据"
              icon={<Star className="h-4 w-4 text-primary" />}
              total={syncData.reviews.total}
              synced={syncData.reviews.synced}
              lastSync={syncData.reviews.lastSync}
              status={syncData.reviews.status}
              onSync={() => handleSync("reviews")}
            />
            <SyncStatusCard
              title="物流数据"
              icon={<Truck className="h-4 w-4 text-primary" />}
              total={856}
              synced={856}
              lastSync="2023-05-14 14:30:22"
              status="success"
              onSync={() => {}}
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="all">全部活动</TabsTrigger>
              <TabsTrigger value="success">成功</TabsTrigger>
              <TabsTrigger value="issues">问题</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">同步活动记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 divide-y">
                    {activities.map((activity, index) => (
                      <SyncActivity key={index} {...activity} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="success">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">成功同步记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 divide-y">
                    {activities
                      .filter((a) => a.status === "success")
                      .map((activity, index) => (
                        <SyncActivity key={index} {...activity} />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">同步问题记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 divide-y">
                    {activities
                      .filter((a) => a.status === "warning" || a.status === "error")
                      .map((activity, index) => (
                        <SyncActivity key={index} {...activity} />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

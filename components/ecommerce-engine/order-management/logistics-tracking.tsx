"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Warehouse,
} from "lucide-react"

interface TrackingTimelineProps {
  steps: {
    status: string
    location: string
    timestamp: string
    description: string
    isCompleted: boolean
    isCurrent?: boolean
  }[]
}

function TrackingTimeline({ steps }: TrackingTimelineProps) {
  return (
    <div className="space-y-4 mt-4">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step.isCompleted
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  : step.isCurrent
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.isCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : step.isCurrent ? (
                <Clock className="h-5 w-5" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              )}
            </div>
            {index < steps.length - 1 && <div className="w-0.5 h-12 bg-muted mx-auto mt-1 mb-1" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <div className="font-medium">{step.status}</div>
              <div className="text-sm text-muted-foreground">{step.timestamp}</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{step.location}</div>
            <div className="text-sm mt-1">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface ShipmentCardProps {
  orderNumber: string
  trackingNumber: string
  carrier: string
  status: string
  estimatedDelivery: string
  origin: string
  destination: string
  lastUpdate: string
  progress: number
  onTrack: () => void
}

function ShipmentCard({
  orderNumber,
  trackingNumber,
  carrier,
  status,
  estimatedDelivery,
  origin,
  destination,
  lastUpdate,
  progress,
  onTrack,
}: ShipmentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">订单 #{orderNumber}</CardTitle>
            <CardDescription>
              运单号: {trackingNumber} | {carrier}
            </CardDescription>
          </div>
          <Badge
            className={
              status === "已送达"
                ? "bg-green-500"
                : status === "运输中"
                  ? "bg-blue-500"
                  : status === "派送中"
                    ? "bg-purple-500"
                    : status === "延迟"
                      ? "bg-amber-500"
                      : "bg-red-500"
            }
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">发货地:</span>
              <span>{origin}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">目的地:</span>
              <span>{destination}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">配送进度</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <span className="text-muted-foreground">预计送达: </span>
              <span>{estimatedDelivery}</span>
            </div>
            <div>
              <span className="text-muted-foreground">最后更新: </span>
              <span>{lastUpdate}</span>
            </div>
          </div>

          <Button onClick={onTrack} className="w-full">
            查看物流详情
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function LogisticsTracking() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isTracking, setIsTracking] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)

  const handleTrack = () => {
    setIsTracking(true)
    // 模拟API调用
    setTimeout(() => {
      setIsTracking(false)
    }, 1500)
  }

  const handleViewShipment = (trackingNumber: string) => {
    setSelectedShipment(trackingNumber)
  }

  // 模拟物流数据
  const shipments = [
    {
      orderNumber: "ORD-2023-1248",
      trackingNumber: "SF1234567890",
      carrier: "顺丰速运",
      status: "运输中",
      estimatedDelivery: "2023-05-16",
      origin: "上海",
      destination: "北京",
      lastUpdate: "2023-05-14 15:30:22",
      progress: 45,
    },
    {
      orderNumber: "ORD-2023-1247",
      trackingNumber: "YT9876543210",
      carrier: "圆通速递",
      status: "已送达",
      estimatedDelivery: "2023-05-14",
      origin: "广州",
      destination: "深圳",
      lastUpdate: "2023-05-14 10:15:36",
      progress: 100,
    },
    {
      orderNumber: "ORD-2023-1246",
      trackingNumber: "ZT5678901234",
      carrier: "中通快递",
      status: "派送中",
      estimatedDelivery: "2023-05-15",
      origin: "杭州",
      destination: "苏州",
      lastUpdate: "2023-05-14 12:45:18",
      progress: 75,
    },
    {
      orderNumber: "ORD-2023-1245",
      trackingNumber: "JD6789012345",
      carrier: "京东物流",
      status: "延迟",
      estimatedDelivery: "2023-05-17",
      origin: "成都",
      destination: "重庆",
      lastUpdate: "2023-05-14 09:20:45",
      progress: 30,
    },
    {
      orderNumber: "ORD-2023-1244",
      trackingNumber: "YD7890123456",
      carrier: "韵达快递",
      status: "异常",
      estimatedDelivery: "未知",
      origin: "武汉",
      destination: "长沙",
      lastUpdate: "2023-05-14 08:15:30",
      progress: 20,
    },
  ]

  // 模拟物流跟踪详情
  const trackingDetails = {
    SF1234567890: {
      orderNumber: "ORD-2023-1248",
      trackingNumber: "SF1234567890",
      carrier: "顺丰速运",
      status: "运输中",
      estimatedDelivery: "2023-05-16",
      origin: "上海",
      destination: "北京",
      lastUpdate: "2023-05-14 15:30:22",
      steps: [
        {
          status: "已下单",
          location: "上海市",
          timestamp: "2023-05-13 10:30:22",
          description: "订单已创建，等待揽收",
          isCompleted: true,
        },
        {
          status: "已揽收",
          location: "上海市浦东新区转运中心",
          timestamp: "2023-05-13 14:45:18",
          description: "快递员已揽收包裹",
          isCompleted: true,
        },
        {
          status: "运输中",
          location: "上海市浦东新区转运中心",
          timestamp: "2023-05-13 18:20:45",
          description: "包裹已从上海市浦东新区转运中心发出",
          isCompleted: true,
        },
        {
          status: "运输中",
          location: "北京市转运中心",
          timestamp: "2023-05-14 15:30:22",
          description: "包裹已到达���京市转运中心",
          isCompleted: true,
          isCurrent: true,
        },
        {
          status: "派送中",
          location: "北京市朝阳区",
          timestamp: "",
          description: "包裹正在派送中",
          isCompleted: false,
        },
        {
          status: "已送达",
          location: "北京市朝阳区",
          timestamp: "",
          description: "包裹已送达，签收人：XXX",
          isCompleted: false,
        },
      ],
    },
  }

  // 过滤物流数据
  const filteredShipments = shipments.filter((shipment) => {
    const matchesCarrier = carrier === "all" || shipment.carrier === carrier
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "in-transit" && shipment.status === "运输中") ||
      (activeTab === "delivered" && shipment.status === "已送达") ||
      (activeTab === "out-for-delivery" && shipment.status === "派送中") ||
      (activeTab === "delayed" && shipment.status === "延迟") ||
      (activeTab === "exception" && shipment.status === "异常")

    return matchesCarrier && matchesStatus
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>物流跟踪</CardTitle>
          <CardDescription>跟踪和管理订单的物流状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="输入运单号查询"
                  className="pl-9"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={carrier} onValueChange={setCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择物流公司" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有物流公司</SelectItem>
                    <SelectItem value="顺丰速运">顺丰速运</SelectItem>
                    <SelectItem value="圆通速递">圆通速递</SelectItem>
                    <SelectItem value="中通快递">中通快递</SelectItem>
                    <SelectItem value="京东物流">京东物流</SelectItem>
                    <SelectItem value="韵达快递">韵达快递</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleTrack} disabled={isTracking || !trackingNumber}>
                {isTracking ? "查询中..." : "查询物流"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">共 {filteredShipments.length} 个物流订单</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>刷新</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>导出</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="in-transit">运输中</TabsTrigger>
                <TabsTrigger value="out-for-delivery">派送中</TabsTrigger>
                <TabsTrigger value="delivered">已送达</TabsTrigger>
                <TabsTrigger value="delayed">延迟</TabsTrigger>
                <TabsTrigger value="exception">异常</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {selectedShipment ? (
                  <div className="space-y-6">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => setSelectedShipment(null)}
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      <span>返回列表</span>
                    </Button>

                    <Card>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <CardTitle>物流详情</CardTitle>
                            <CardDescription>
                              运单号:{" "}
                              {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.trackingNumber} |{" "}
                              {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.carrier}
                            </CardDescription>
                          </div>
                          <Badge
                            className={
                              trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status === "已送达"
                                ? "bg-green-500"
                                : trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status === "运输中"
                                  ? "bg-blue-500"
                                  : trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status ===
                                      "派送中"
                                    ? "bg-purple-500"
                                    : trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status ===
                                        "延迟"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                            }
                          >
                            {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium mb-2">订单信息</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">订单号:</span>
                                  <span>
                                    {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.orderNumber}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">运单号:</span>
                                  <span>
                                    {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.trackingNumber}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">物流公司:</span>
                                  <span>
                                    {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.carrier}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">预计送达:</span>
                                  <span>
                                    {
                                      trackingDetails[selectedShipment as keyof typeof trackingDetails]
                                        ?.estimatedDelivery
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium mb-2">地址信息</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">发货地:</span>
                                  <span>
                                    {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.origin}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">目的地:</span>
                                  <span>
                                    {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.destination}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>官网查询</span>
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Download className="h-3.5 w-3.5" />
                                <span>下载物流单</span>
                              </Button>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-2">配送进度</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">当前状态</span>
                                <span>{trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status}</span>
                              </div>
                              <Progress
                                value={
                                  trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status === "已送达"
                                    ? 100
                                    : trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status ===
                                        "派送中"
                                      ? 75
                                      : trackingDetails[selectedShipment as keyof typeof trackingDetails]?.status ===
                                          "运输中"
                                        ? 45
                                        : 30
                                }
                                className="h-2"
                              />
                              <div className="grid grid-cols-3 text-xs text-muted-foreground mt-1">
                                <div>已揽收</div>
                                <div className="text-center">运输中</div>
                                <div className="text-right">已送达</div>
                              </div>
                            </div>

                            <div className="mt-6">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium">最新动态</h3>
                                <span className="text-xs text-muted-foreground">
                                  {trackingDetails[selectedShipment as keyof typeof trackingDetails]?.lastUpdate}
                                </span>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-md">
                                <p className="text-sm">
                                  {
                                    trackingDetails[selectedShipment as keyof typeof trackingDetails]?.steps.find(
                                      (step) => step.isCurrent,
                                    )?.description
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">物流跟踪记录</h3>
                          <TrackingTimeline
                            steps={trackingDetails[selectedShipment as keyof typeof trackingDetails]?.steps || []}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : filteredShipments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredShipments.map((shipment) => (
                      <ShipmentCard
                        key={shipment.trackingNumber}
                        {...shipment}
                        onTrack={() => handleViewShipment(shipment.trackingNumber)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">没有找到物流订单</h3>
                    <p className="text-muted-foreground mt-2">尝试调整过滤条件或搜索其他运单号</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

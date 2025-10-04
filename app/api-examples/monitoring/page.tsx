"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// 模型状态类型
interface ModelStatus {
  id: string
  name: string
  status: "operational" | "degraded" | "outage" | "unknown"
  latency: number // 毫秒
  lastChecked: string
}

// 配额使用情况类型
interface QuotaUsage {
  model: string
  used: number
  total: number
  unit: string
  resetDate: string
}

// 请求历史类型
interface RequestHistory {
  date: string
  successful: number
  failed: number
  totalTokens: number
}

// 模拟数据
const MOCK_MODEL_STATUS: ModelStatus[] = [
  {
    id: "glm-4",
    name: "GLM-4",
    status: "operational",
    latency: 320,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "glm-4v",
    name: "GLM-4V",
    status: "operational",
    latency: 450,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "glm-3-turbo",
    name: "GLM-3-Turbo",
    status: "degraded",
    latency: 780,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "cogview-3",
    name: "CogView-3",
    status: "operational",
    latency: 1200,
    lastChecked: new Date().toISOString(),
  },
]

const MOCK_QUOTA_USAGE: QuotaUsage[] = [
  {
    model: "GLM-4",
    used: 15000,
    total: 100000,
    unit: "tokens",
    resetDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
  },
  {
    model: "GLM-4V",
    used: 8000,
    total: 50000,
    unit: "tokens",
    resetDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
  },
  {
    model: "GLM-3-Turbo",
    used: 120000,
    total: 500000,
    unit: "tokens",
    resetDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
  },
  {
    model: "CogView-3",
    used: 25,
    total: 100,
    unit: "images",
    resetDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
  },
]

// 生成过去7天的请求历史
const generateMockRequestHistory = (): RequestHistory[] => {
  const history: RequestHistory[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const successful = Math.floor(Math.random() * 100) + 50
    const failed = Math.floor(Math.random() * 10)
    const totalTokens = successful * (Math.floor(Math.random() * 500) + 500)

    history.push({
      date: date.toISOString().split("T")[0],
      successful,
      failed,
      totalTokens,
    })
  }

  return history
}

export default function MonitoringPage() {
  const { toast } = useToast()
  const [modelStatus, setModelStatus] = useState<ModelStatus[]>(MOCK_MODEL_STATUS)
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsage[]>(MOCK_QUOTA_USAGE)
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>(generateMockRequestHistory())
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("status")

  // 刷新状态
  const refreshStatus = async () => {
    try {
      setRefreshing(true)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 更新模型状态（随机变化一些值）
      setModelStatus((prev) =>
        prev.map((model) => ({
          ...model,
          status: Math.random() > 0.9 ? "degraded" : "operational",
          latency: model.latency + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 100),
          lastChecked: new Date().toISOString(),
        })),
      )

      // 更新配额使用情况（增加使用量）
      setQuotaUsage((prev) =>
        prev.map((quota) => ({
          ...quota,
          used: Math.min(quota.used + Math.floor(Math.random() * 1000), quota.total),
        })),
      )

      toast({
        title: "状态已更新",
        description: "服务状态监控数据已刷新",
      })
    } catch (error) {
      console.error("刷新状态错误:", error)
      toast({
        title: "刷新失败",
        description: "无法获取最新状态数据",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // 获取状态标签
  const getStatusBadge = (status: ModelStatus["status"]) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">正常运行</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">性能下降</Badge>
      case "outage":
        return <Badge className="bg-red-100 text-red-800">服务中断</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">未知状态</Badge>
    }
  }

  // 获取延迟评级
  const getLatencyRating = (latency: number) => {
    if (latency < 300) return "优秀"
    if (latency < 500) return "良好"
    if (latency < 800) return "一般"
    return "较慢"
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  // 计算使用百分比
  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">智谱AI服务状态监控</h1>
          <p className="text-muted-foreground">监控智谱AI服务的状态、配额使用情况和请求历史</p>
        </div>

        <Button onClick={refreshStatus} disabled={refreshing}>
          {refreshing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          刷新状态
        </Button>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          此页面展示了如何监控智谱AI服务的状态和使用情况，帮助您及时发现问题并优化API使用。
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="status">服务状态</TabsTrigger>
          <TabsTrigger value="quota">配额使用</TabsTrigger>
          <TabsTrigger value="history">请求历史</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modelStatus.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{model.name}</CardTitle>
                      <CardDescription>模型ID: {model.id}</CardDescription>
                    </div>
                    {getStatusBadge(model.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>响应延迟</span>
                        <span>
                          {model.latency}ms ({getLatencyRating(model.latency)})
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, (model.latency / 1000) * 100)}
                        className={`h-2 ${
                          model.latency < 300
                            ? "bg-green-100"
                            : model.latency < 500
                              ? "bg-blue-100"
                              : model.latency < 800
                                ? "bg-yellow-100"
                                : "bg-red-100"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>最后检查时间:</span>
                      <span>{new Date(model.lastChecked).toLocaleString("zh-CN")}</span>
                    </div>

                    <div className="flex gap-2">
                      {model.status === "operational" ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>服务正常</span>
                        </div>
                      ) : model.status === "degraded" ? (
                        <div className="flex items-center text-yellow-600 text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>性能下降</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span>服务中断</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quota" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotaUsage.map((quota, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{quota.model}</CardTitle>
                  <CardDescription>配额使用情况</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>已使用</span>
                      <span>
                        {quota.used.toLocaleString()} / {quota.total.toLocaleString()} {quota.unit}
                      </span>
                    </div>
                    <Progress
                      value={calculateUsagePercentage(quota.used, quota.total)}
                      className={`h-2 ${
                        calculateUsagePercentage(quota.used, quota.total) < 50
                          ? "bg-green-100"
                          : calculateUsagePercentage(quota.used, quota.total) < 80
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>使用率</span>
                    <span
                      className={`font-medium ${
                        calculateUsagePercentage(quota.used, quota.total) < 50
                          ? "text-green-600"
                          : calculateUsagePercentage(quota.used, quota.total) < 80
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {calculateUsagePercentage(quota.used, quota.total)}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>剩余</span>
                    <span>
                      {(quota.total - quota.used).toLocaleString()} {quota.unit}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span>重置日期</span>
                    <span>{formatDate(quota.resetDate)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    查看详细用量
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>请求历史</CardTitle>
              <CardDescription>过去7天的API请求情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">请求成功率</h3>
                  <div className="h-64 flex items-end gap-2">
                    {requestHistory.map((day) => {
                      const total = day.successful + day.failed
                      const successRate = total > 0 ? (day.successful / total) * 100 : 0

                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col items-center">
                            <div
                              className="w-full bg-green-500 rounded-t-sm"
                              style={{ height: `${successRate * 0.6}%` }}
                            ></div>
                            {day.failed > 0 && (
                              <div
                                className="w-full bg-red-500"
                                style={{ height: `${(100 - successRate) * 0.6}%` }}
                              ></div>
                            )}
                          </div>
                          <div className="text-xs mt-2">{day.date.split("-")[2]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Token使用量</h3>
                  <div className="h-64 flex items-end gap-2">
                    {requestHistory.map((day) => {
                      const maxTokens = Math.max(...requestHistory.map((d) => d.totalTokens))
                      const heightPercentage = (day.totalTokens / maxTokens) * 100

                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-t-sm"
                            style={{ height: `${heightPercentage * 0.6}%` }}
                          ></div>
                          <div className="text-xs mt-2">{day.date.split("-")[2]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">详细数据</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">日期</th>
                          <th className="text-right py-2">成功请求</th>
                          <th className="text-right py-2">失败请求</th>
                          <th className="text-right py-2">成功率</th>
                          <th className="text-right py-2">Token使用量</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestHistory.map((day) => {
                          const total = day.successful + day.failed
                          const successRate = total > 0 ? (day.successful / total) * 100 : 0

                          return (
                            <tr key={day.date} className="border-b">
                              <td className="py-2">{formatDate(day.date)}</td>
                              <td className="text-right py-2">{day.successful}</td>
                              <td className="text-right py-2">{day.failed}</td>
                              <td className="text-right py-2">
                                <span className={successRate > 95 ? "text-green-600" : "text-yellow-600"}>
                                  {successRate.toFixed(1)}%
                                </span>
                              </td>
                              <td className="text-right py-2">{day.totalTokens.toLocaleString()}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ProviderHealthCheck({ providers }) {
  const { toast } = useToast()
  const [healthData, setHealthData] = useState([])
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)

  useEffect(() => {
    // 初始化健康数据
    const initialHealthData = providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      status: provider.healthStatus || "unknown",
      latency: null,
      uptime: Math.floor(Math.random() * 20) + 80, // 模拟80-100%的上线时间
      errorRate: Math.floor(Math.random() * 5), // 模拟0-5%的错误率
    }))
    setHealthData(initialHealthData)
  }, [providers])

  const runHealthCheck = async () => {
    setIsChecking(true)

    // 模拟健康检查过程
    const updatedHealthData = [...healthData]

    // 为每个提供商进行模拟健康检查
    for (let i = 0; i < updatedHealthData.length; i++) {
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 随机生成健康状态
      const randomValue = Math.random()
      let status
      let latency

      if (randomValue > 0.8) {
        status = "unhealthy"
        latency = Math.floor(Math.random() * 1000) + 1000 // 1000-2000ms
      } else if (randomValue > 0.6) {
        status = "degraded"
        latency = Math.floor(Math.random() * 500) + 500 // 500-1000ms
      } else {
        status = "healthy"
        latency = Math.floor(Math.random() * 300) + 100 // 100-400ms
      }

      updatedHealthData[i] = {
        ...updatedHealthData[i],
        status,
        latency,
        lastChecked: new Date().toISOString(),
      }

      // 更新状态以显示进度
      setHealthData([...updatedHealthData])
    }

    setIsChecking(false)
    setLastChecked(new Date())

    toast({
      title: "健康检查完成",
      description: `已完成${providers.length}个AI提供商的健康检查`,
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "healthy":
        return "正常"
      case "degraded":
        return "性能下降"
      case "unhealthy":
        return "不可用"
      default:
        return "未知"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "healthy":
        return <Badge variant="success">正常</Badge>
      case "degraded":
        return <Badge variant="warning">性能下降</Badge>
      case "unhealthy":
        return <Badge variant="destructive">不可用</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          {lastChecked && (
            <p className="text-sm text-muted-foreground">上次检查时间: {lastChecked.toLocaleString("zh-CN")}</p>
          )}
        </div>
        <Button onClick={runHealthCheck} disabled={isChecking}>
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              检查中...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              运行健康检查
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {healthData.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.latency ? `延迟: ${item.latency}ms` : "尚未检查"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">状态:</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="mt-1">
                      <span className="text-sm">上线率: {item.uptime}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>错误率</span>
                  <span>{item.errorRate}%</span>
                </div>
                <Progress value={item.errorRate} max={10} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

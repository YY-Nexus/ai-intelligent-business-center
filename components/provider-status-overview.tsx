"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react"

export function ProviderStatusOverview() {
  const providers = [
    {
      name: "百度智能云",
      model: "文心一言",
      status: "正常",
      latency: 320,
      uptime: 99.8,
      lastCheck: "2分钟前",
      costPerToken: 0.002,
    },
    {
      name: "讯飞开放平台",
      model: "星火认知",
      status: "正常",
      latency: 280,
      uptime: 99.9,
      lastCheck: "3分钟前",
      costPerToken: 0.0018,
    },
    {
      name: "智谱AI",
      model: "ChatGLM",
      status: "正常",
      latency: 310,
      uptime: 99.7,
      lastCheck: "1分钟前",
      costPerToken: 0.0015,
    },
    {
      name: "阿里云",
      model: "通义千问",
      status: "正常",
      latency: 350,
      uptime: 99.6,
      lastCheck: "4分钟前",
      costPerToken: 0.0022,
    },
    {
      name: "腾讯云",
      model: "混元",
      status: "正常",
      latency: 290,
      uptime: 99.5,
      lastCheck: "2分钟前",
      costPerToken: 0.0019,
    },
    {
      name: "MiniMax",
      model: "ABAB",
      status: "异常",
      latency: 520,
      uptime: 98.2,
      lastCheck: "1分钟前",
      costPerToken: 0.0017,
    },
    {
      name: "Moonshot AI",
      model: "Moonshot",
      status: "正常",
      latency: 300,
      uptime: 99.4,
      lastCheck: "3分钟前",
      costPerToken: 0.0016,
    },
    {
      name: "百川智能",
      model: "Baichuan",
      status: "维护中",
      latency: 0,
      uptime: 95.8,
      lastCheck: "5分钟前",
      costPerToken: 0.0014,
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "正常":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "异常":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "维护中":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "离线":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "正常":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            正常
          </Badge>
        )
      case "异常":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            异常
          </Badge>
        )
      case "维护中":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            维护中
          </Badge>
        )
      case "离线":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            离线
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {providers.map((provider) => (
        <div key={provider.name} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{provider.name}</h3>
                {getStatusBadge(provider.status)}
              </div>
              <p className="text-sm text-muted-foreground">模型: {provider.model}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(provider.status)}
              <span className="text-sm">最后检查: {provider.lastCheck}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">延迟</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">{provider.status === "维护中" ? "N/A" : `${provider.latency}ms`}</span>
                <span className="text-xs text-muted-foreground">
                  {provider.latency < 300 ? "良好" : provider.latency < 400 ? "一般" : "较慢"}
                </span>
              </div>
              {provider.status !== "维护中" && (
                <Progress
                  value={100 - provider.latency / 10}
                  className="h-2 mt-1"
                  indicatorClassName={
                    provider.latency < 300 ? "bg-green-500" : provider.latency < 400 ? "bg-amber-500" : "bg-red-500"
                  }
                />
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">可用性</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">{provider.uptime}%</span>
                <span className="text-xs text-muted-foreground">过去30天</span>
              </div>
              <Progress
                value={provider.uptime}
                className="h-2 mt-1"
                indicatorClassName={
                  provider.uptime > 99.5 ? "bg-green-500" : provider.uptime > 99 ? "bg-amber-500" : "bg-red-500"
                }
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">成本</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">¥{provider.costPerToken}/token</span>
                <span className="text-xs text-muted-foreground">
                  {provider.costPerToken < 0.0016 ? "低" : provider.costPerToken < 0.002 ? "中" : "高"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

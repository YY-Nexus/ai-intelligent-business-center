"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSystemTools } from "./system-tools-context"
import { Activity, Clock, Zap, Wrench, Database } from "lucide-react"

// 活动类型
type ActivityType = "scan" | "fix" | "optimize" | "monitor" | "backup" | "restore"

// 活动状态
type ActivityStatus = "success" | "failed" | "warning"

// 活动记录
interface ActivityLog {
  id: string
  type: ActivityType
  description: string
  status: ActivityStatus
  timestamp: Date
  details?: string
}

export function SystemToolsActivity() {
  const { issues } = useSystemTools()
  const [activities, setActivities] = useState<ActivityLog[]>([])

  // 生成活动记录
  useEffect(() => {
    // 从问题状态变化生成活动记录
    const newActivities: ActivityLog[] = []

    // 添加固定的示例活动
    const sampleActivities: ActivityLog[] = [
      {
        id: "activity-1",
        type: "scan",
        description: "系统扫描完成",
        status: "success",
        timestamp: new Date(Date.now() - 3600000), // 1小时前
        details: "扫描发现5个潜在问题",
      },
      {
        id: "activity-2",
        type: "fix",
        description: "自动修复CSRF漏洞",
        status: "success",
        timestamp: new Date(Date.now() - 7200000), // 2小时前
        details: "成功修复安全漏洞：缺少CSRF保护",
      },
      {
        id: "activity-3",
        type: "optimize",
        description: "系统优化完成",
        status: "success",
        timestamp: new Date(Date.now() - 86400000), // 1天前
        details: "成功优化数据库连接池和缓存配置",
      },
      {
        id: "activity-4",
        type: "backup",
        description: "系统备份完成",
        status: "success",
        timestamp: new Date(Date.now() - 172800000), // 2天前
        details: "备份ID: backup-1682345678",
      },
      {
        id: "activity-5",
        type: "fix",
        description: "修复API响应时间问题",
        status: "failed",
        timestamp: new Date(Date.now() - 259200000), // 3天前
        details: "修复失败：需要手动优化数据库查询",
      },
    ]

    // 从问题状态生成活动记录
    issues.forEach((issue) => {
      if (issue.status === "fixed" && issue.updatedAt) {
        newActivities.push({
          id: `fix-${issue.id}`,
          type: "fix",
          description: `修复问题：${issue.title}`,
          status: "success",
          timestamp: issue.updatedAt,
          details: issue.description,
        })
      } else if (issue.status === "failed" && issue.updatedAt) {
        newActivities.push({
          id: `fix-${issue.id}`,
          type: "fix",
          description: `修复失败：${issue.title}`,
          status: "failed",
          timestamp: issue.updatedAt,
          details: issue.description,
        })
      }
    })

    // 合并并按时间排序
    const allActivities = [...newActivities, ...sampleActivities]
    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setActivities(allActivities)
  }, [issues])

  return (
    <Card>
      <CardHeader>
        <CardTitle>活动记录</CardTitle>
        <CardDescription>系统工具活动历史记录</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-md">
                <div className="mt-1">{getActivityIcon(activity.type, activity.status)}</div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.description}</span>
                      <Badge variant="outline" className={getStatusClass(activity.status)}>
                        {getStatusLabel(activity.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                  {activity.details && <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>}
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>暂无活动记录</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// 获取活动图标
function getActivityIcon(type: ActivityType, status: ActivityStatus) {
  const iconClass = status === "success" ? "text-green-500" : status === "failed" ? "text-red-500" : "text-yellow-500"

  switch (type) {
    case "scan":
      return <Activity className={`h-5 w-5 ${iconClass}`} />
    case "fix":
      return <Wrench className={`h-5 w-5 ${iconClass}`} />
    case "optimize":
      return <Zap className={`h-5 w-5 ${iconClass}`} />
    case "monitor":
      return <Activity className={`h-5 w-5 ${iconClass}`} />
    case "backup":
      return <Database className={`h-5 w-5 ${iconClass}`} />
    case "restore":
      return <Database className={`h-5 w-5 ${iconClass}`} />
    default:
      return <Activity className={`h-5 w-5 ${iconClass}`} />
  }
}

// 获取状态标签
function getStatusLabel(status: ActivityStatus): string {
  switch (status) {
    case "success":
      return "成功"
    case "failed":
      return "失败"
    case "warning":
      return "警告"
    default:
      return status
  }
}

// 获取状态样式类
function getStatusClass(status: ActivityStatus): string {
  switch (status) {
    case "success":
      return "bg-green-50 text-green-700 border-green-200"
    case "failed":
      return "bg-red-50 text-red-700 border-red-200"
    case "warning":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    default:
      return ""
  }
}

// 格式化时间戳
function formatTimestamp(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()

  // 小于1分钟
  if (diff < 60000) {
    return "刚刚"
  }

  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }

  // 小于1天
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }

  // 小于1周
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}天前`
  }

  // 其他情况显示完整日期
  return timestamp.toLocaleString()
}

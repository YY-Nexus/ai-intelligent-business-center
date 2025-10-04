"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Search,
} from "lucide-react"

interface LogEntryProps {
  id: string
  timestamp: string
  platform: string
  endpoint: string
  method: string
  status: number
  duration: number
  expanded?: boolean
  onToggle: () => void
}

function LogEntry({
  id,
  timestamp,
  platform,
  endpoint,
  method,
  status,
  duration,
  expanded = false,
  onToggle,
}: LogEntryProps) {
  return (
    <div className="border rounded-md mb-2 overflow-hidden">
      <div className="flex items-center p-3 cursor-pointer hover:bg-muted/50" onClick={onToggle}>
        <div className="mr-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 grid grid-cols-12 gap-2 items-center text-sm">
          <div className="col-span-3 flex items-center gap-2">
            <div className="flex-shrink-0">
              {status >= 200 && status < 300 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : status >= 400 && status < 500 ? (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <span className="font-medium truncate">{platform}</span>
          </div>
          <div className="col-span-3 truncate">{endpoint}</div>
          <div className="col-span-1">
            <Badge
              variant="outline"
              className={
                method === "GET"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : method === "POST"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : method === "PUT"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      : method === "DELETE"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : ""
              }
            >
              {method}
            </Badge>
          </div>
          <div className="col-span-1">
            <Badge
              variant="outline"
              className={
                status >= 200 && status < 300
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : status >= 400 && status < 500
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }
            >
              {status}
            </Badge>
          </div>
          <div className="col-span-2 text-muted-foreground">{timestamp}</div>
          <div className="col-span-2 text-right text-muted-foreground">{duration}ms</div>
        </div>
      </div>

      {expanded && (
        <div className="p-3 pt-0 border-t bg-muted/30">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <h4 className="text-xs font-medium mb-1">请求详情</h4>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {`${method} ${endpoint}
Host: api.${platform.toLowerCase().replace(/\s+/g, "")}.com
Authorization: Bearer ***************
Content-Type: application/json
User-Agent: API-OS/1.0`}
              </pre>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-1">响应详情</h4>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {`HTTP/1.1 ${status} ${status >= 200 && status < 300 ? "OK" : "Error"}
Date: ${timestamp}
Content-Type: application/json
Content-Length: 1234

${JSON.stringify({ success: status >= 200 && status < 300, message: status >= 200 && status < 300 ? "操作成功" : "请求失败", requestId: id }, null, 2)}`}
              </pre>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>导出日志</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function IntegrationLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platform, setPlatform] = useState("all")
  const [status, setStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedLogs, setExpandedLogs] = useState<string[]>([])

  const toggleLogExpansion = (id: string) => {
    setExpandedLogs((prev) => (prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]))
  }

  // 模拟日志数据
  const logs = [
    {
      id: "req-001",
      timestamp: "2023-05-14 14:30:22",
      platform: "淘宝/天猫",
      endpoint: "/api/products",
      method: "GET",
      status: 200,
      duration: 156,
    },
    {
      id: "req-002",
      timestamp: "2023-05-14 14:30:20",
      platform: "淘宝/天猫",
      endpoint: "/api/orders",
      method: "GET",
      status: 200,
      duration: 189,
    },
    {
      id: "req-003",
      timestamp: "2023-05-14 14:30:18",
      platform: "淘宝/天猫",
      endpoint: "/api/inventory",
      method: "GET",
      status: 206,
      duration: 210,
    },
    {
      id: "req-004",
      timestamp: "2023-05-14 14:30:15",
      platform: "抖音小店",
      endpoint: "/api/products",
      method: "GET",
      status: 200,
      duration: 143,
    },
    {
      id: "req-005",
      timestamp: "2023-05-14 14:30:12",
      platform: "抖音小店",
      endpoint: "/api/orders",
      method: "GET",
      status: 200,
      duration: 167,
    },
    {
      id: "req-006",
      timestamp: "2023-05-14 14:30:10",
      platform: "抖音小店",
      endpoint: "/api/reviews",
      method: "GET",
      status: 206,
      duration: 198,
    },
    {
      id: "req-007",
      timestamp: "2023-05-14 14:29:58",
      platform: "淘宝/天猫",
      endpoint: "/api/products/123",
      method: "PUT",
      status: 200,
      duration: 176,
    },
    {
      id: "req-008",
      timestamp: "2023-05-14 14:29:45",
      platform: "抖音小店",
      endpoint: "/api/inventory/update",
      method: "POST",
      status: 400,
      duration: 145,
    },
    {
      id: "req-009",
      timestamp: "2023-05-14 14:29:30",
      platform: "淘宝/天猫",
      endpoint: "/api/orders/456/cancel",
      method: "POST",
      status: 200,
      duration: 187,
    },
    {
      id: "req-010",
      timestamp: "2023-05-14 14:29:15",
      platform: "抖音小店",
      endpoint: "/api/products/789",
      method: "DELETE",
      status: 200,
      duration: 132,
    },
    {
      id: "req-011",
      timestamp: "2023-05-14 14:29:00",
      platform: "淘宝/天猫",
      endpoint: "/api/inventory/batch",
      method: "POST",
      status: 500,
      duration: 234,
    },
    {
      id: "req-012",
      timestamp: "2023-05-14 14:28:45",
      platform: "抖音小店",
      endpoint: "/api/customers",
      method: "GET",
      status: 200,
      duration: 156,
    },
  ]

  // 过滤和排序日志
  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.platform.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPlatform = platform === "all" || log.platform === platform

      const matchesStatus =
        status === "all" ||
        (status === "success" && log.status >= 200 && log.status < 300) ||
        (status === "warning" && log.status >= 400 && log.status < 500) ||
        (status === "error" && log.status >= 500)

      return matchesSearch && matchesPlatform && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>集成日志</CardTitle>
          <CardDescription>查看API集成的详细日志记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索端点或平台..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="平台" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有平台</SelectItem>
                    <SelectItem value="淘宝/天猫">淘宝/天猫</SelectItem>
                    <SelectItem value="抖音小店">抖音小店</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="状态" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="error">错误</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              >
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">显示最近12条日志记录</span>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>导出所有日志</span>
            </Button>
          </div>

          <div className="space-y-1">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <LogEntry
                  key={log.id}
                  id={log.id}
                  timestamp={log.timestamp}
                  platform={log.platform}
                  endpoint={log.endpoint}
                  method={log.method}
                  status={log.status}
                  duration={log.duration}
                  expanded={expandedLogs.includes(log.id)}
                  onToggle={() => toggleLogExpansion(log.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">没有找到匹配的日志记录</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

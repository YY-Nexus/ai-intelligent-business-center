"use client"

import { useState, useEffect } from "react"
import { useApiConfig } from "./api-config-manager"
import { ApiHistoryService, type ApiRequestHistory } from "@/lib/api-binding/history/history-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Trash2,
  RefreshCw,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Play,
  Download,
  BarChart2,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiHistory() {
  const { configs, getConfigById } = useApiConfig()
  const { toast } = useToast()
  const [selectedConfigId, setSelectedConfigId] = useState<string>("")
  const [history, setHistory] = useState<ApiRequestHistory[]>([])
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ApiRequestHistory | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("history")
  const [analyticsData, setAnalyticsData] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    methodDistribution: {} as Record<string, number>,
    statusDistribution: {} as Record<string, number>,
    topEndpoints: [] as { path: string; count: number }[],
  })

  // 加载历史记录
  useEffect(() => {
    if (selectedConfigId) {
      const historyItems = ApiHistoryService.getHistoryByApiId(selectedConfigId)
      setHistory(historyItems)
      updateAnalytics(historyItems)
    } else {
      const allHistory = ApiHistoryService.getAllHistory()
      setHistory(allHistory)
      updateAnalytics(allHistory)
    }
  }, [selectedConfigId])

  // 更新分析数据
  const updateAnalytics = (historyItems: ApiRequestHistory[]) => {
    if (historyItems.length === 0) {
      setAnalyticsData({
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        methodDistribution: {},
        statusDistribution: {},
        topEndpoints: [],
      })
      return
    }

    // 计算总请求数
    const totalRequests = historyItems.length

    // 计算成功率
    const successfulRequests = historyItems.filter(
      (item) => item.responseStatus >= 200 && item.responseStatus < 300,
    ).length
    const successRate = (successfulRequests / totalRequests) * 100

    // 计算平均响应时间
    const totalResponseTime = historyItems.reduce((sum, item) => sum + item.duration, 0)
    const avgResponseTime = totalResponseTime / totalRequests

    // 计算方法分布
    const methodDistribution: Record<string, number> = {}
    historyItems.forEach((item) => {
      methodDistribution[item.method] = (methodDistribution[item.method] || 0) + 1
    })

    // 计算状态码分布
    const statusDistribution: Record<string, number> = {}
    historyItems.forEach((item) => {
      const statusGroup = Math.floor(item.responseStatus / 100) * 100
      statusDistribution[statusGroup] = (statusDistribution[statusGroup] || 0) + 1
    })

    // 计算热门端点
    const endpointCounts: Record<string, number> = {}
    historyItems.forEach((item) => {
      endpointCounts[item.path] = (endpointCounts[item.path] || 0) + 1
    })

    const topEndpoints = Object.entries(endpointCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setAnalyticsData({
      totalRequests,
      successRate,
      avgResponseTime,
      methodDistribution,
      statusDistribution,
      topEndpoints,
    })
  }

  // 刷新历史记录
  const refreshHistory = () => {
    if (selectedConfigId) {
      const historyItems = ApiHistoryService.getHistoryByApiId(selectedConfigId)
      setHistory(historyItems)
      updateAnalytics(historyItems)
    } else {
      const allHistory = ApiHistoryService.getAllHistory()
      setHistory(allHistory)
      updateAnalytics(allHistory)
    }
    toast({
      title: "历史记录已刷新",
      description: "API请求历史记录已更新。",
    })
  }

  // 清除历史记录
  const clearHistory = () => {
    const success = ApiHistoryService.clearHistory(selectedConfigId || undefined)
    if (success) {
      setHistory([])
      setSelectedHistoryItem(null)
      updateAnalytics([])
      toast({
        title: "历史记录已清除",
        description: selectedConfigId ? "已清除所选API的历史记录。" : "已清除所有API的历史记录。",
      })
    } else {
      toast({
        title: "清除失败",
        description: "无法清除历史记录。",
        variant: "destructive",
      })
    }
  }

  // 删除单个历史记录
  const deleteHistoryItem = (id: string) => {
    const success = ApiHistoryService.deleteHistoryItem(id)
    if (success) {
      const updatedHistory = history.filter((item) => item.id !== id)
      setHistory(updatedHistory)
      updateAnalytics(updatedHistory)
      if (selectedHistoryItem && selectedHistoryItem.id === id) {
        setSelectedHistoryItem(null)
      }
      toast({
        title: "记录已删除",
        description: "已删除所选历史记录。",
      })
    } else {
      toast({
        title: "删除失败",
        description: "无法删除历史记录。",
        variant: "destructive",
      })
    }
  }

  // 导出历史记录
  const exportHistory = () => {
    if (history.length === 0) {
      toast({
        title: "无数据可导出",
        description: "没有历史记录可供导出。",
        variant: "destructive",
      })
      return
    }

    const filename = `api-history-${selectedConfigId ? getConfigById(selectedConfigId)?.name || "selected" : "all"}-${new Date().toISOString().slice(0, 10)}.json`
    const dataStr = JSON.stringify(history, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "导出成功",
      description: `历史记录已导出为 ${filename}。`,
    })
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 格式化持续时间
  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`
    } else {
      return `${(duration / 1000).toFixed(2)}s`
    }
  }

  // 获取状态码颜色
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-green-500"
    } else if (status >= 300 && status < 400) {
      return "bg-blue-500"
    } else if (status >= 400 && status < 500) {
      return "bg-yellow-500"
    } else if (status >= 500) {
      return "bg-red-500"
    } else {
      return "bg-gray-500"
    }
  }

  // 获取方法颜色
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-500"
      case "POST":
        return "bg-green-500"
      case "PUT":
        return "bg-yellow-500"
      case "DELETE":
        return "bg-red-500"
      case "PATCH":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  // 获取日期范围
  const getDateRange = () => {
    const now = new Date()
    switch (dateRangeFilter) {
      case "today":
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return [today, now]
      case "yesterday":
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return [yesterday, endOfYesterday]
      case "week":
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        return [weekAgo, now]
      case "month":
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return [monthAgo, now]
      default:
        return null
    }
  }

  // 过滤和排序历史记录
  const filteredHistory = history
    .filter((item) => {
      // 搜索词过滤
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        item.url.toLowerCase().includes(searchLower) ||
        item.path.toLowerCase().includes(searchLower) ||
        (item.error && item.error.toLowerCase().includes(searchLower))

      // 方法过滤
      const matchesMethod = !methodFilter || item.method.toUpperCase() === methodFilter

      // 状态过滤
      let matchesStatus = true
      if (statusFilter) {
        if (statusFilter === "success") {
          matchesStatus = item.responseStatus >= 200 && item.responseStatus < 300
        } else if (statusFilter === "redirect") {
          matchesStatus = item.responseStatus >= 300 && item.responseStatus < 400
        } else if (statusFilter === "clientError") {
          matchesStatus = item.responseStatus >= 400 && item.responseStatus < 500
        } else if (statusFilter === "serverError") {
          matchesStatus = item.responseStatus >= 500
        } else if (statusFilter === "error") {
          matchesStatus = !!item.error
        }
      }

      // 日期范围过滤
      let matchesDateRange = true
      const dateRange = getDateRange()
      if (dateRange) {
        const itemDate = new Date(item.timestamp)
        matchesDateRange = itemDate >= dateRange[0] && itemDate <= dateRange[1]
      }

      return matchesSearch && matchesMethod && matchesStatus && matchesDateRange
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  // 重放请求
  const replayRequest = (item: ApiRequestHistory) => {
    toast({
      title: "重放请求",
      description: "正在准备重放请求...",
    })

    // 跳转到测试页面并预填充请求信息
    window.location.href = `/api-config?tab=test&id=${item.configId}&path=${encodeURIComponent(item.path)}&method=${item.method}`
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history">请求历史</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="w-full md:w-1/3">
              <Label htmlFor="config-select">API配置</Label>
              <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
                <SelectTrigger id="config-select">
                  <SelectValue placeholder="所有API" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有API</SelectItem>
                  {configs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshHistory} size="icon" title="刷新">
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button variant="outline" onClick={exportHistory} size="icon" title="导出">
                <Download className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" title="清除历史">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认清除历史记录</AlertDialogTitle>
                    <AlertDialogDescription>
                      {selectedConfigId ? "您确定要清除所选API的所有历史记录吗？" : "您确定要清除所有API的历史记录吗？"}
                      此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={clearHistory}>清除</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>请求历史</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        title={sortOrder === "desc" ? "最新优先" : "最早优先"}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        {sortOrder === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative w-full md:w-1/2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索URL或路径..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Select value={methodFilter} onValueChange={setMethodFilter}>
                        <SelectTrigger className="w-[110px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>{methodFilter || "方法"}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">所有方法</SelectItem>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[110px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>
                              {statusFilter === "success"
                                ? "成功"
                                : statusFilter === "redirect"
                                  ? "重定向"
                                  : statusFilter === "clientError"
                                    ? "客户端错误"
                                    : statusFilter === "serverError"
                                      ? "服务器错误"
                                      : statusFilter === "error"
                                        ? "请求错误"
                                        : "状态"}
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">所有状态</SelectItem>
                          <SelectItem value="success">成功 (2xx)</SelectItem>
                          <SelectItem value="redirect">重定向 (3xx)</SelectItem>
                          <SelectItem value="clientError">客户端错误 (4xx)</SelectItem>
                          <SelectItem value="serverError">服务器错误 (5xx)</SelectItem>
                          <SelectItem value="error">请求错误</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                        <SelectTrigger className="w-[110px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>
                              {dateRangeFilter === "today"
                                ? "今天"
                                : dateRangeFilter === "yesterday"
                                  ? "昨天"
                                  : dateRangeFilter === "week"
                                    ? "本周"
                                    : dateRangeFilter === "month"
                                      ? "本月"
                                      : "时间"}
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有时间</SelectItem>
                          <SelectItem value="today">今天</SelectItem>
                          <SelectItem value="yesterday">昨天</SelectItem>
                          <SelectItem value="week">最近7天</SelectItem>
                          <SelectItem value="month">最近30天</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {filteredHistory.length > 0 ? (
                      <div className="space-y-2">
                        {filteredHistory.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 rounded-md border cursor-pointer transition-colors ${
                              selectedHistoryItem?.id === item.id ? "border-primary bg-muted" : "hover:bg-muted/50"
                            }`}
                            onClick={() => setSelectedHistoryItem(item)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getMethodColor(item.method)} text-white`}>{item.method}</Badge>
                                <div className="font-mono text-sm truncate max-w-[200px] md:max-w-[300px]">
                                  {item.path}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.error ? (
                                  <Badge variant="destructive">错误</Badge>
                                ) : (
                                  <Badge className={`${getStatusColor(item.responseStatus)} text-white`}>
                                    {item.responseStatus}
                                  </Badge>
                                )}
                                <Badge variant="outline">{formatDuration(item.duration)}</Badge>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                              <span>{formatDate(item.timestamp)}</span>
                              <span>{getConfigById(item.configId)?.name || "未知API"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {history.length > 0 ? "没有符合筛选条件的历史记录" : "尚无API请求历史记录"}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-1/3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>请求详情</CardTitle>
                  <CardDescription>
                    {selectedHistoryItem ? "查看API请求和响应的详细信息" : "选择一个历史记录项查看详情"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedHistoryItem ? (
                    <div className="space-y-6">
                      <div className="flex justify-between">
                        <div>
                          <Badge className={`${getMethodColor(selectedHistoryItem.method)} text-white`}>
                            {selectedHistoryItem.method}
                          </Badge>{" "}
                          <Badge className={`${getStatusColor(selectedHistoryItem.responseStatus)} text-white`}>
                            {selectedHistoryItem.responseStatus}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              操作
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => replayRequest(selectedHistoryItem)}>
                              <Play className="h-4 w-4 mr-2" />
                              重放请求
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteHistoryItem(selectedHistoryItem.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除记录
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <Label>URL</Label>
                        <div className="p-2 bg-muted rounded-md font-mono text-sm break-all">
                          {selectedHistoryItem.url}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>时间</Label>
                          <div className="p-2 bg-muted rounded-md text-sm">
                            {formatDate(selectedHistoryItem.timestamp)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>持续时间</Label>
                          <div className="p-2 bg-muted rounded-md text-sm">
                            {formatDuration(selectedHistoryItem.duration)}
                          </div>
                        </div>
                      </div>

                      <Collapsible className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>请求头</Label>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <ScrollArea className="h-[100px]">
                            <div className="p-2 bg-muted rounded-md font-mono text-xs">
                              {Object.entries(selectedHistoryItem.headers).length > 0 ? (
                                Object.entries(selectedHistoryItem.headers).map(([key, value]) => (
                                  <div key={key} className="flex">
                                    <span className="font-semibold min-w-[120px]">{key}:</span>
                                    <span className="break-all">{value}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">无请求头</div>
                              )}
                            </div>
                          </ScrollArea>
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>查询参数</Label>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <ScrollArea className="h-[100px]">
                            <div className="p-2 bg-muted rounded-md font-mono text-xs">
                              {Object.entries(selectedHistoryItem.queryParams).length > 0 ? (
                                Object.entries(selectedHistoryItem.queryParams).map(([key, value]) => (
                                  <div key={key} className="flex">
                                    <span className="font-semibold min-w-[120px]">{key}:</span>
                                    <span className="break-all">{value}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">无查询参数</div>
                              )}
                            </div>
                          </ScrollArea>
                        </CollapsibleContent>
                      </Collapsible>

                      {selectedHistoryItem.requestBody && (
                        <Collapsible className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>请求体</Label>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <ScrollArea className="h-[150px]">
                              <div className="p-2 bg-muted rounded-md font-mono text-xs whitespace-pre">
                                {typeof selectedHistoryItem.requestBody === "object"
                                  ? JSON.stringify(selectedHistoryItem.requestBody, null, 2)
                                  : selectedHistoryItem.requestBody}
                              </div>
                            </ScrollArea>
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      <Separator />

                      <Collapsible className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>响应头</Label>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <ScrollArea className="h-[100px]">
                            <div className="p-2 bg-muted rounded-md font-mono text-xs">
                              {Object.entries(selectedHistoryItem.responseHeaders).length > 0 ? (
                                Object.entries(selectedHistoryItem.responseHeaders).map(([key, value]) => (
                                  <div key={key} className="flex">
                                    <span className="font-semibold min-w-[120px]">{key}:</span>
                                    <span className="break-all">{value}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">无响应头</div>
                              )}
                            </div>
                          </ScrollArea>
                        </CollapsibleContent>
                      </Collapsible>

                      {selectedHistoryItem.responseBody && (
                        <Collapsible className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>响应体</Label>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <ScrollArea className="h-[200px]">
                              <div className="p-2 bg-muted rounded-md font-mono text-xs whitespace-pre">
                                {typeof selectedHistoryItem.responseBody === "object"
                                  ? JSON.stringify(selectedHistoryItem.responseBody, null, 2)
                                  : selectedHistoryItem.responseBody}
                              </div>
                            </ScrollArea>
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      {selectedHistoryItem.error && (
                        <div className="space-y-2">
                          <Label>错误信息</Label>
                          <div className="p-2 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-md text-sm">
                            {selectedHistoryItem.error}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">选择左侧的历史记录项查看详情</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>总请求数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalRequests}</div>
                <p className="text-sm text-muted-foreground">
                  {selectedConfigId
                    ? `${getConfigById(selectedConfigId)?.name || "所选API"}的总请求数`
                    : "所有API的总请求数"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>成功率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.successRate.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground">请求成功率 (2xx 响应)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>平均响应时间</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.avgResponseTime.toFixed(0)} ms</div>
                <p className="text-sm text-muted-foreground">所有请求的平均响应时间</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>请求方法分布</CardTitle>
                <CardDescription>各HTTP方法的使用情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.methodDistribution).length > 0 ? (
                    Object.entries(analyticsData.methodDistribution).map(([method, count]) => {
                      const percentage = (count / analyticsData.totalRequests) * 100
                      return (
                        <div key={method} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{method}</span>
                            <span>
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getMethodColor(method)} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">暂无数据</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>状态码分布</CardTitle>
                <CardDescription>各HTTP状态码的分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.statusDistribution).length > 0 ? (
                    Object.entries(analyticsData.statusDistribution).map(([statusGroup, count]) => {
                      const percentage = (count / analyticsData.totalRequests) * 100
                      const statusInt = Number.parseInt(statusGroup)
                      let statusLabel = ""
                      let statusClass = ""

                      if (statusInt === 200) {
                        statusLabel = "成功 (2xx)"
                        statusClass = "bg-green-500"
                      } else if (statusInt === 300) {
                        statusLabel = "重定向 (3xx)"
                        statusClass = "bg-blue-500"
                      } else if (statusInt === 400) {
                        statusLabel = "客户端错误 (4xx)"
                        statusClass = "bg-yellow-500"
                      } else if (statusInt === 500) {
                        statusLabel = "服务器错误 (5xx)"
                        statusClass = "bg-red-500"
                      } else {
                        statusLabel = `状态码 ${statusGroup}`
                        statusClass = "bg-gray-500"
                      }

                      return (
                        <div key={statusGroup} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{statusLabel}</span>
                            <span>
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${statusClass} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">暂无数据</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>热门API端点</CardTitle>
              <CardDescription>请求量最高的API端点</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.topEndpoints.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.topEndpoints.map((endpoint, index) => {
                    const percentage = (endpoint.count / analyticsData.totalRequests) * 100
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium font-mono truncate max-w-[300px]" title={endpoint.path}>
                            {endpoint.path}
                          </span>
                          <span>
                            {endpoint.count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">暂无数据</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("history")}>
                <BarChart2 className="mr-2 h-4 w-4" />
                查看详细历史记录
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

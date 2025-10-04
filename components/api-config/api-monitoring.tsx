"use client"

import { useState, useEffect } from "react"
import { useApiConfig } from "./api-config-manager"
import { MonitoringService, type MonitoringResult } from "@/lib/api-binding/monitoring/monitoring-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Play, Pause, Settings, Trash2, Download } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
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
import MonitoringChart from "./monitoring-chart"

export default function ApiMonitoring() {
  const { configs, getConfigById } = useApiConfig()
  const { toast } = useToast()
  const [selectedConfigId, setSelectedConfigId] = useState("")
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitoringInterval, setMonitoringInterval] = useState(60) // 秒
  const [monitoringResults, setMonitoringResults] = useState<MonitoringResult[]>([])
  const [monitoringSettings, setMonitoringSettings] = useState({
    checkAvailability: true,
    checkResponseTime: true,
    checkStatusCode: true,
    expectedStatusCode: 200,
    timeout: 30000, // 毫秒
    alertThreshold: 1000, // 毫秒
  })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [monitoringTimer, setMonitoringTimer] = useState<NodeJS.Timeout | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [statusSummary, setStatusSummary] = useState({
    total: 0,
    available: 0,
    degraded: 0,
    unavailable: 0,
  })

  // 加载监控结果
  useEffect(() => {
    if (selectedConfigId) {
      const results = MonitoringService.getMonitoringResults(selectedConfigId)
      setMonitoringResults(results)
      updateStatusSummary(results)
      setLastUpdated(new Date())
    } else {
      setMonitoringResults([])
      setStatusSummary({
        total: 0,
        available: 0,
        degraded: 0,
        unavailable: 0,
      })
    }
  }, [selectedConfigId])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (monitoringTimer) {
        clearInterval(monitoringTimer)
      }
    }
  }, [monitoringTimer])

  // 更新状态摘要
  const updateStatusSummary = (results: MonitoringResult[]) => {
    if (results.length === 0) {
      setStatusSummary({
        total: 0,
        available: 0,
        degraded: 0,
        unavailable: 0,
      })
      return
    }

    const total = results.length
    const available = results.filter((r) => r.available && r.responseTime < monitoringSettings.alertThreshold).length
    const degraded = results.filter((r) => r.available && r.responseTime >= monitoringSettings.alertThreshold).length
    const unavailable = results.filter((r) => !r.available).length

    setStatusSummary({
      total,
      available,
      degraded,
      unavailable,
    })
  }

  // 开始监控
  const startMonitoring = () => {
    if (!selectedConfigId) {
      toast({
        title: "请选择API",
        description: "请先选择要监控的API配置。",
        variant: "destructive",
      })
      return
    }

    // 立即执行一次监控
    performMonitoring()

    // 设置定时器
    const timer = setInterval(performMonitoring, monitoringInterval * 1000)
    setMonitoringTimer(timer)
    setIsMonitoring(true)

    toast({
      title: "监控已启动",
      description: `API监控已启动，间隔为 ${monitoringInterval} 秒。`,
    })
  }

  // 停止监控
  const stopMonitoring = () => {
    if (monitoringTimer) {
      clearInterval(monitoringTimer)
      setMonitoringTimer(null)
    }
    setIsMonitoring(false)

    toast({
      title: "监控已停止",
      description: "API监控已停止。",
    })
  }

  // 执行监控
  const performMonitoring = async () => {
    if (!selectedConfigId) return

    const apiConfig = getConfigById(selectedConfigId)
    if (!apiConfig) return

    const result = await MonitoringService.checkEndpoint(selectedConfigId, apiConfig.config.baseUrl, monitoringSettings)

    // 更新监控结果
    setMonitoringResults((prev) => {
      const newResults = [result, ...prev]
      // 限制结果数量，保留最新的100条
      const limitedResults = newResults.slice(0, 100)
      // 保存到本地存储
      MonitoringService.saveMonitoringResults(selectedConfigId, limitedResults)
      // 更新状态摘要
      updateStatusSummary(limitedResults)
      // 更新最后更新时间
      setLastUpdated(new Date())
      return limitedResults
    })

    // 检查是否需要发出警报
    if (
      (monitoringSettings.checkStatusCode && result.statusCode !== monitoringSettings.expectedStatusCode) ||
      (monitoringSettings.checkResponseTime && result.responseTime > monitoringSettings.alertThreshold) ||
      (monitoringSettings.checkAvailability && !result.available)
    ) {
      toast({
        title: "API监控警报",
        description: `${apiConfig.name}: ${
          !result.available
            ? "API不可用"
            : result.statusCode !== monitoringSettings.expectedStatusCode
              ? `状态码异常 (${result.statusCode})`
              : `响应时间过长 (${result.responseTime}ms)`
        }`,
        variant: "destructive",
      })
    }
  }

  // 清除监控结果
  const clearMonitoringResults = () => {
    if (selectedConfigId) {
      MonitoringService.clearMonitoringResults(selectedConfigId)
      setMonitoringResults([])
      setStatusSummary({
        total: 0,
        available: 0,
        degraded: 0,
        unavailable: 0,
      })
      toast({
        title: "监控结果已清除",
        description: "所有监控结果已被清除。",
      })
    }
  }

  // 导出监控结果
  const exportMonitoringResults = () => {
    if (monitoringResults.length === 0) {
      toast({
        title: "无数据可导出",
        description: "没有监控结果可供导出。",
        variant: "destructive",
      })
      return
    }

    const apiConfig = getConfigById(selectedConfigId)
    const filename = `api-monitoring-${apiConfig?.name || "unknown"}-${new Date().toISOString().slice(0, 10)}.json`

    const dataStr = JSON.stringify(monitoringResults, null, 2)
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
      description: `监控结果已导出为 ${filename}。`,
    })
  }

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("zh-CN")
  }

  // 获取状态标签
  const getStatusBadge = (result: MonitoringResult) => {
    if (!result.available) {
      return <Badge variant="destructive">不可用</Badge>
    }

    if (monitoringSettings.checkStatusCode && result.statusCode !== monitoringSettings.expectedStatusCode) {
      return <Badge variant="destructive">状态码异常</Badge>
    }

    if (monitoringSettings.checkResponseTime && result.responseTime > monitoringSettings.alertThreshold) {
      return <Badge variant="destructive">响应缓慢</Badge>
    }

    return <Badge variant="success">正常</Badge>
  }

  // 获取整体状态
  const getOverallStatus = () => {
    if (monitoringResults.length === 0) {
      return <Badge variant="outline">未监控</Badge>
    }

    const unavailablePercentage = (statusSummary.unavailable / statusSummary.total) * 100
    const degradedPercentage = (statusSummary.degraded / statusSummary.total) * 100

    if (unavailablePercentage > 10) {
      return <Badge variant="destructive">严重问题</Badge>
    } else if (unavailablePercentage > 0 || degradedPercentage > 20) {
      return <Badge variant="warning">性能下降</Badge>
    } else {
      return <Badge variant="success">健康</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div className="w-full md:w-1/3">
          <Label htmlFor="config-select">选择API配置</Label>
          <Select
            value={selectedConfigId}
            onValueChange={(value) => {
              setSelectedConfigId(value)
              // 如果正在监控，停止当前监控
              if (isMonitoring) {
                stopMonitoring()
              }
            }}
          >
            <SelectTrigger id="config-select">
              <SelectValue placeholder="选择API配置" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {isMonitoring ? (
            <Button variant="outline" onClick={stopMonitoring}>
              <Pause className="mr-2 h-4 w-4" />
              停止监控
            </Button>
          ) : (
            <Button onClick={startMonitoring} disabled={!selectedConfigId}>
              <Play className="mr-2 h-4 w-4" />
              开始监控
            </Button>
          )}

          <Button variant="outline" onClick={() => setActiveTab("settings")} size="icon" title="监控设置">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedConfigId ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard">监控面板</TabsTrigger>
            <TabsTrigger value="history">历史记录</TabsTrigger>
            <TabsTrigger value="settings">监控设置</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>整体状态</CardTitle>
                  <CardDescription>API端点整体健康状态</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold flex items-center gap-2">{getOverallStatus()}</div>
                    {lastUpdated && (
                      <p className="text-sm text-muted-foreground">最后更新: {lastUpdated.toLocaleString("zh-CN")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>可用性</CardTitle>
                  <CardDescription>API端点可用性</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {monitoringResults.length > 0
                      ? `${Math.round((statusSummary.available / statusSummary.total) * 100)}%`
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">基于最近 {monitoringResults.length} 次检查</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>平均响应时间</CardTitle>
                  <CardDescription>API响应时间</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {monitoringResults.length > 0
                      ? `${Math.round(
                          monitoringResults.reduce((sum, r) => sum + r.responseTime, 0) / monitoringResults.length,
                        )}ms`
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">基于最近 {monitoringResults.length} 次检查</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>响应时间趋势</CardTitle>
                <CardDescription>API响应时间历史趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <MonitoringChart
                    data={monitoringResults.slice().reverse()}
                    threshold={monitoringSettings.alertThreshold}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>状态分布</CardTitle>
                <CardDescription>API状态分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-green-600">{statusSummary.available}</div>
                    <div className="text-sm text-muted-foreground">正常</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-yellow-600">{statusSummary.degraded}</div>
                    <div className="text-sm text-muted-foreground">性能下降</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-red-600">{statusSummary.unavailable}</div>
                    <div className="text-sm text-muted-foreground">不可用</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">监控历史记录</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportMonitoringResults}
                  disabled={monitoringResults.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={monitoringResults.length === 0}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      清除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认清除</AlertDialogTitle>
                      <AlertDialogDescription>您确定要清除所有监控历史记录吗？此操作无法撤销。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={clearMonitoringResults}>清除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">时间</th>
                        <th className="text-left p-3">状态</th>
                        <th className="text-left p-3">响应时间</th>
                        <th className="text-left p-3">状态码</th>
                        <th className="text-left p-3">错误</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monitoringResults.length > 0 ? (
                        monitoringResults.map((result, index) => (
                          <tr
                            key={result.timestamp}
                            className={`border-b ${
                              !result.available ||
                              (monitoringSettings.checkStatusCode &&
                                result.statusCode !== monitoringSettings.expectedStatusCode) ||
                              (
                                monitoringSettings.checkResponseTime &&
                                  result.responseTime > monitoringSettings.alertThreshold
                              )
                                ? "bg-red-50 dark:bg-red-900/10"
                                : index % 2 === 0
                                  ? "bg-muted/50"
                                  : ""
                            }`}
                          >
                            <td className="p-3">{formatDate(result.timestamp)}</td>
                            <td className="p-3">{getStatusBadge(result)}</td>
                            <td className="p-3">{result.available ? `${result.responseTime}ms` : "-"}</td>
                            <td className="p-3">{result.available ? result.statusCode : "-"}</td>
                            <td className="p-3 max-w-[300px] truncate">{result.error || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-muted-foreground">
                            尚无监控历史记录
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>监控设置</CardTitle>
                <CardDescription>配置API监控参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">监控间隔</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span>检查频率</span>
                      <span className="font-medium">{monitoringInterval} 秒</span>
                    </div>
                    <Slider
                      value={[monitoringInterval]}
                      min={10}
                      max={300}
                      step={10}
                      onValueChange={(value) => setMonitoringInterval(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">设置API检查的时间间隔，范围从10秒到5分钟</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">检查项目</h3>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="check-availability"
                      checked={monitoringSettings.checkAvailability}
                      onCheckedChange={(checked) =>
                        setMonitoringSettings({
                          ...monitoringSettings,
                          checkAvailability: checked,
                        })
                      }
                    />
                    <Label htmlFor="check-availability">检查可用性</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="check-response-time"
                      checked={monitoringSettings.checkResponseTime}
                      onCheckedChange={(checked) =>
                        setMonitoringSettings({
                          ...monitoringSettings,
                          checkResponseTime: checked,
                        })
                      }
                    />
                    <Label htmlFor="check-response-time">检查响应时间</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="check-status-code"
                      checked={monitoringSettings.checkStatusCode}
                      onCheckedChange={(checked) =>
                        setMonitoringSettings({
                          ...monitoringSettings,
                          checkStatusCode: checked,
                        })
                      }
                    />
                    <Label htmlFor="check-status-code">检查状态码</Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">阈值设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected-status">预期状态码</Label>
                      <Input
                        id="expected-status"
                        type="number"
                        value={monitoringSettings.expectedStatusCode}
                        onChange={(e) =>
                          setMonitoringSettings({
                            ...monitoringSettings,
                            expectedStatusCode: Number.parseInt(e.target.value) || 200,
                          })
                        }
                      />
                      <p className="text-sm text-muted-foreground">API正常响应的HTTP状态码</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeout">请求超时 (毫秒)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={monitoringSettings.timeout}
                        onChange={(e) =>
                          setMonitoringSettings({
                            ...monitoringSettings,
                            timeout: Number.parseInt(e.target.value) || 30000,
                          })
                        }
                      />
                      <p className="text-sm text-muted-foreground">请求超时时间，超过此时间视为不可用</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="alert-threshold">响应时间警报阈值 (毫秒)</Label>
                      <Input
                        id="alert-threshold"
                        type="number"
                        value={monitoringSettings.alertThreshold}
                        onChange={(e) =>
                          setMonitoringSettings({
                            ...monitoringSettings,
                            alertThreshold: Number.parseInt(e.target.value) || 1000,
                          })
                        }
                      />
                      <p className="text-sm text-muted-foreground">响应时间超过此阈值将触发警报</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      toast({
                        title: "设置已保存",
                        description: "监控设置已成功保存。",
                      })
                    }}
                  >
                    保存设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">请选择一个API配置以开始监控</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

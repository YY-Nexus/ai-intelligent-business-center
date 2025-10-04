"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  XCircle,
  Bell,
  Mail,
  Webhook,
} from "lucide-react"
import { apiConfigStorage } from "@/lib/api-binding/config/config-storage"
import { monitoringService, type MonitoringConfig } from "@/lib/monitoring/monitoring-service"
import { useToast } from "@/components/ui/use-toast"
import type { ApiConfig } from "@/lib/api-binding/config/config-types"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
} from "recharts"

export function ApiMonitoringDashboard() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({})
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [monitoringConfig, setMonitoringConfig] = useState<MonitoringConfig>({
    enabled: true,
    interval: 5,
    endpoints: [],
    alertThresholds: {
      responseTime: 1000,
      errorRate: 5,
      availability: 95,
    },
    notificationChannels: {
      email: [],
      webhook: "",
      browser: true,
    },
  })
  const [newEndpoint, setNewEndpoint] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  // 加载API配置
  useEffect(() => {
    const loadConfigs = async () => {
      const configs = await apiConfigStorage.getAllConfigs()
      setConfigs(configs)

      // 如果有配置，选择第一个
      const configIds = Object.keys(configs)
      if (configIds.length > 0 && !selectedConfigId) {
        setSelectedConfigId(configIds[0])
      }
    }

    loadConfigs()
  }, [selectedConfigId])

  // 加载监控配置
  useEffect(() => {
    if (selectedConfigId) {
      // 在实际应用中，这里应该从存储中加载监控配置
      // 这里仅作为示例，使用默认配置
      const config = configs[selectedConfigId]
      if (config) {
        // 启动监控
        monitoringService.startMonitoring(selectedConfigId, config, monitoringConfig)
      }
    }

    // 清理函数
    return () => {
      if (selectedConfigId) {
        monitoringService.stopMonitoring(selectedConfigId)
      }
    }
  }, [selectedConfigId, configs, monitoringConfig, refreshKey])

  // 获取选中的API配置
  const selectedConfig = selectedConfigId ? configs[selectedConfigId] : null

  // 获取监控结果
  const monitoringResults = selectedConfigId ? monitoringService.getResults(selectedConfigId) : []

  // 获取监控摘要
  const monitoringSummary = selectedConfigId ? monitoringService.getSummary(selectedConfigId) : null

  // 获取监控状态
  const monitoringStatus = selectedConfigId ? monitoringService.getStatus(selectedConfigId) : "unknown"

  // 添加端点
  const addEndpoint = () => {
    if (!newEndpoint.trim()) return

    setMonitoringConfig({
      ...monitoringConfig,
      endpoints: [...monitoringConfig.endpoints, newEndpoint.trim()],
    })

    setNewEndpoint("")
  }

  // 移除端点
  const removeEndpoint = (endpoint: string) => {
    setMonitoringConfig({
      ...monitoringConfig,
      endpoints: monitoringConfig.endpoints.filter((e) => e !== endpoint),
    })
  }

  // 添加电子邮件
  const addEmail = () => {
    if (!newEmail.trim()) return

    setMonitoringConfig({
      ...monitoringConfig,
      notificationChannels: {
        ...monitoringConfig.notificationChannels,
        email: [...(monitoringConfig.notificationChannels.email || []), newEmail.trim()],
      },
    })

    setNewEmail("")
  }

  // 移除电子邮件
  const removeEmail = (email: string) => {
    setMonitoringConfig({
      ...monitoringConfig,
      notificationChannels: {
        ...monitoringConfig.notificationChannels,
        email: monitoringConfig.notificationChannels.email?.filter((e) => e !== email) || [],
      },
    })
  }

  // 保存监控配置
  const saveMonitoringConfig = () => {
    if (!selectedConfigId) return

    // 在实际应用中，这里应该保存监控配置到存储
    // 这里仅作为示例
    toast({
      title: "配置已保存",
      description: "监控配置已成功保存",
    })

    // 重新启动监控
    const config = configs[selectedConfigId]
    if (config) {
      monitoringService.stopMonitoring(selectedConfigId)
      monitoringService.startMonitoring(selectedConfigId, config, monitoringConfig)
    }
  }

  // 刷新监控
  const refreshMonitoring = () => {
    if (!selectedConfigId) return

    // 重新启动监控
    const config = configs[selectedConfigId]
    if (config) {
      monitoringService.stopMonitoring(selectedConfigId)
      monitoringService.startMonitoring(selectedConfigId, config, monitoringConfig)
      setRefreshKey(refreshKey + 1)

      toast({
        title: "监控已刷新",
        description: "API监控已重新启动",
      })
    }
  }

  // 清除监控结果
  const clearMonitoringResults = () => {
    if (!selectedConfigId) return

    monitoringService.clearResults(selectedConfigId)
    setRefreshKey(refreshKey + 1)

    toast({
      title: "结果已清除",
      description: "监���结果已清除",
    })
  }

  // 准备图表数据
  const prepareChartData = () => {
    if (!monitoringResults || monitoringResults.length === 0) {
      return []
    }

    // 获取最近的20个结果
    return monitoringResults.slice(-20).map((result) => ({
      timestamp: new Date(result.timestamp).toLocaleTimeString(),
      responseTime: result.success ? result.responseTime : 0,
      status: result.status,
      success: result.success ? 1 : 0,
      failure: result.success ? 0 : 1,
    }))
  }

  const chartData = prepareChartData()

  // 状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            在线
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            性能下降
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            离线
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API监控</h2>
          <p className="text-muted-foreground">监控API的可用性、性能和错误率</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedConfigId || ""} onValueChange={setSelectedConfigId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择API配置" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(configs).map(([id, config]) => (
                <SelectItem key={id} value={id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={refreshMonitoring}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {selectedConfig ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">
              <Activity className="h-4 w-4 mr-2" />
              监控面板
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              监控设置
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              历史记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">{getStatusBadge(monitoringStatus)}</div>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">可用性</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">{monitoringSummary?.availability.toFixed(1)}%</div>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">平均响应时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">{monitoringSummary?.avgResponseTime.toFixed(0)} ms</div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>响应时间趋势</CardTitle>
                  <CardDescription>最近20次请求的响应时间</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line
                            type="monotone"
                            dataKey="responseTime"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                            name="响应时间 (ms)"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">暂无数据</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>成功/失败率</CardTitle>
                  <CardDescription>最近20次请求的成功和失败次数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="success" stackId="a" fill="#22c55e" name="成功" />
                          <Bar dataKey="failure" stackId="a" fill="#ef4444" name="失败" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">暂无数据</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>监控摘要</CardTitle>
                <CardDescription>API监控的总体统计信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">总请求数</div>
                    <div className="text-2xl font-bold">{monitoringSummary?.totalRequests || 0}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">成功请求</div>
                    <div className="text-2xl font-bold text-green-600">
                      {monitoringSummary?.successfulRequests || 0}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">失败请求</div>
                    <div className="text-2xl font-bold text-red-600">{monitoringSummary?.failedRequests || 0}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={clearMonitoringResults}>
                  清除监控结果
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基本设置</CardTitle>
                <CardDescription>配置API监控的基本参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="monitoring-enabled">启用监控</Label>
                  <Switch
                    id="monitoring-enabled"
                    checked={monitoringConfig.enabled}
                    onCheckedChange={(checked) => setMonitoringConfig({ ...monitoringConfig, enabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monitoring-interval">监控间隔（分钟）</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="monitoring-interval"
                      min={1}
                      max={60}
                      step={1}
                      value={[monitoringConfig.interval]}
                      onValueChange={(value) => setMonitoringConfig({ ...monitoringConfig, interval: value[0] })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{monitoringConfig.interval}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>监控端点</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入端点路径"
                      value={newEndpoint}
                      onChange={(e) => setNewEndpoint(e.target.value)}
                    />
                    <Button onClick={addEndpoint}>添加</Button>
                  </div>

                  <div className="space-y-2 mt-2">
                    {monitoringConfig.endpoints.length === 0 ? (
                      <div className="text-sm text-muted-foreground">未配置端点，将使用API配置中的默认端点</div>
                    ) : (
                      monitoringConfig.endpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{endpoint}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeEndpoint(endpoint)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>警报阈值</CardTitle>
                <CardDescription>设置触发警报的阈值</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="response-time-threshold">响应时间阈值（毫秒）</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="response-time-threshold"
                      min={100}
                      max={5000}
                      step={100}
                      value={[monitoringConfig.alertThresholds.responseTime]}
                      onValueChange={(value) =>
                        setMonitoringConfig({
                          ...monitoringConfig,
                          alertThresholds: {
                            ...monitoringConfig.alertThresholds,
                            responseTime: value[0],
                          },
                        })
                      }
                      className="flex-1"
                    />
                    <span className="w-16 text-center">{monitoringConfig.alertThresholds.responseTime} ms</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-rate-threshold">错误率阈值（%）</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="error-rate-threshold"
                      min={1}
                      max={50}
                      step={1}
                      value={[monitoringConfig.alertThresholds.errorRate]}
                      onValueChange={(value) =>
                        setMonitoringConfig({
                          ...monitoringConfig,
                          alertThresholds: {
                            ...monitoringConfig.alertThresholds,
                            errorRate: value[0],
                          },
                        })
                      }
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{monitoringConfig.alertThresholds.errorRate}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability-threshold">可用性阈值（%）</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="availability-threshold"
                      min={50}
                      max={100}
                      step={1}
                      value={[monitoringConfig.alertThresholds.availability]}
                      onValueChange={(value) =>
                        setMonitoringConfig({
                          ...monitoringConfig,
                          alertThresholds: {
                            ...monitoringConfig.alertThresholds,
                            availability: value[0],
                          },
                        })
                      }
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{monitoringConfig.alertThresholds.availability}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>通知设置</CardTitle>
                <CardDescription>配置警报通知方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="browser-notifications">浏览器通知</Label>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={monitoringConfig.notificationChannels.browser || false}
                    onValueChange={(checked) =>
                      setMonitoringConfig({
                        ...monitoringConfig,
                        notificationChannels: {
                          ...monitoringConfig.notificationChannels,
                          browser: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>电子邮件通知</Label>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="输入电子邮件地址"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Button onClick={addEmail}>添加</Button>
                  </div>

                  <div className="space-y-2 mt-2">
                    {monitoringConfig.notificationChannels.email?.length === 0 ? (
                      <div className="text-sm text-muted-foreground">未配置电子邮件地址</div>
                    ) : (
                      monitoringConfig.notificationChannels.email?.map((email, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{email}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeEmail(email)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4" />
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                  </div>
                  <Input
                    id="webhook-url"
                    placeholder="https://example.com/webhook"
                    value={monitoringConfig.notificationChannels.webhook || ""}
                    onChange={(e) =>
                      setMonitoringConfig({
                        ...monitoringConfig,
                        notificationChannels: {
                          ...monitoringConfig.notificationChannels,
                          webhook: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveMonitoringConfig}>保存设置</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>监控历史记录</CardTitle>
                <CardDescription>查看API监控的历史记录</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {monitoringResults.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">暂无监控记录</div>
                    ) : (
                      monitoringResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md border ${
                            result.success
                              ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/20"
                              : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/20"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {result.success ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                                <span>
                                  {result.endpoint || "默认端点"} - {result.status}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(result.timestamp).toLocaleString()}
                              </div>
                            </div>
                            {result.success && (
                              <div className="text-sm flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{result.responseTime.toFixed(0)} ms</span>
                              </div>
                            )}
                          </div>
                          {!result.success && result.error && (
                            <div className="mt-2 text-sm text-red-600 dark:text-red-400">错误: {result.error}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearMonitoringResults}>
                  清除历史记录
                </Button>
                <Button variant="outline" onClick={refreshMonitoring}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">未选择API配置</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
              请从下拉菜单中选择一个API配置，或者创建一个新的API配置来开始监控。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

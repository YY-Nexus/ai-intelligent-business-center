"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Activity, Bell, Clock, RefreshCw, Settings } from "lucide-react"
import { apiConfigStorage } from "@/lib/api-binding/config/config-storage"
import {
  advancedMonitoringService,
  type AlertRule,
  type AlertEvent,
  type AdvancedMetrics,
} from "@/lib/monitoring/advanced-monitoring"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import type { ApiConfig } from "@/lib/api-binding/config/config-types"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

export function AdvancedMonitoringDashboard() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({})
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [refreshKey, setRefreshKey] = useState(0)
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [alertHistory, setAlertHistory] = useState<AlertEvent[]>([])
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetrics | null>(null)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)
  const [newRuleName, setNewRuleName] = useState("")
  const [newRuleMetric, setNewRuleMetric] = useState("responseTimeP95")
  const [newRuleOperator, setNewRuleOperator] = useState("gt")
  const [newRuleValue, setNewRuleValue] = useState(1000)
  const [newRuleEnabled, setNewRuleEnabled] = useState(true)
  const [newRuleCooldown, setNewRuleCooldown] = useState(15)
  const [newRuleDescription, setNewRuleDescription] = useState("")

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

  // 加载警报规则和历史
  useEffect(() => {
    if (selectedConfigId) {
      const rules = advancedMonitoringService.getAlertRules(selectedConfigId)
      setAlertRules(rules)

      const history = advancedMonitoringService.getAlertHistory(selectedConfigId)
      setAlertHistory(history)

      // 如果没有规则，创建默认规则
      if (rules.length === 0) {
        const defaultRules = advancedMonitoringService.createDefaultAlertRules(selectedConfigId)
        setAlertRules(defaultRules)
      }

      // 计算高级指标
      const metrics = advancedMonitoringService.calculateAdvancedMetrics(selectedConfigId)
      setAdvancedMetrics(metrics)

      // 评估警报规则
      const config = configs[selectedConfigId]
      if (config) {
        advancedMonitoringService.evaluateAlertRules(selectedConfigId, config)
      }
    }
  }, [selectedConfigId, configs, refreshKey])

  // 获取选中的API配置
  const selectedConfig = selectedConfigId ? configs[selectedConfigId] : null

  // 刷新监控
  const refreshMonitoring = () => {
    if (!selectedConfigId) return

    // 重新计算指标
    const metrics = advancedMonitoringService.calculateAdvancedMetrics(selectedConfigId)
    setAdvancedMetrics(metrics)

    // 重新评估警报规则
    const config = configs[selectedConfigId]
    if (config) {
      advancedMonitoringService.evaluateAlertRules(selectedConfigId, config)
    }

    // 更新警报历史
    const history = advancedMonitoringService.getAlertHistory(selectedConfigId)
    setAlertHistory(history)

    setRefreshKey(refreshKey + 1)

    toast({
      title: "监控已刷新",
      description: "高级监控指标已更新",
    })
  }

  // 添加警报规则
  const addAlertRule = () => {
    if (!selectedConfigId || !newRuleName.trim()) return

    const rule: AlertRule = {
      id: uuidv4(),
      name: newRuleName.trim(),
      description: newRuleDescription.trim() || `当${newRuleMetric}${getOperatorText(newRuleOperator)}${newRuleValue}时触发警报`,
      condition: {
        type: "threshold",
        metric: newRuleMetric,
        operator: newRuleOperator as any,
        value: newRuleValue,
      },
      actions: [{ type: "notification", target: "browser" }],
      enabled: newRuleEnabled,
      cooldownPeriod: newRuleCooldown,
    }

    advancedMonitoringService.addAlertRule(selectedConfigId, rule)
    setAlertRules([...alertRules, rule])

    // 重置表单
    setNewRuleName("")
    setNewRuleDescription("")
    setNewRuleMetric("responseTimeP95")
    setNewRuleOperator("gt")
    setNewRuleValue(1000)
    setNewRuleEnabled(true)
    setNewRuleCooldown(15)

    toast({
      title: "规则已添加",
      description: `警报规则 "${rule.name}" 已添加`,
    })
  }

  // 删除警报规则
  const deleteAlertRule = (ruleId: string) => {
    if (!selectedConfigId) return

    advancedMonitoringService.removeAlertRule(selectedConfigId, ruleId)
    setAlertRules(alertRules.filter((rule) => rule.id !== ruleId))

    toast({
      title: "规则已删除",
      description: "警报规则已删除",
    })
  }

  // 切换规则启用状态
  const toggleRuleEnabled = (ruleId: string, enabled: boolean) => {
    if (!selectedConfigId) return

    const updatedRules = alertRules.map((rule) => {
      if (rule.id === ruleId) {
        return { ...rule, enabled }
      }
      return rule
    })

    setAlertRules(updatedRules)

    // 更新服务中的规则
    updatedRules.forEach((rule) => {
      advancedMonitoringService.removeAlertRule(selectedConfigId, rule.id)
      advancedMonitoringService.addAlertRule(selectedConfigId, rule)
    })

    toast({
      title: enabled ? "规则已启用" : "规则已禁用",
      description: `警报规则已${enabled ? "启用" : "禁用"}`,
    })
  }

  // 获取操作符文本
  const getOperatorText = (operator: string): string => {
    switch (operator) {
      case "gt":
        return "大于"
      case "lt":
        return "小于"
      case "eq":
        return "等于"
      case "neq":
        return "不等于"
      case "gte":
        return "大于等于"
      case "lte":
        return "小于等于"
      default:
        return "等于"
    }
  }

  // 获取指标名称
  const getMetricName = (metric: string): string => {
    switch (metric) {
      case "responseTimeP95":
        return "95%响应时间"
      case "responseTimeP99":
        return "99%响应时间"
      case "errorRate":
        return "错误率"
      case "availability":
        return "可用性"
      case "requestsPerMinute":
        return "每分钟请求数"
      case "requestsPerHour":
        return "每小时请求数"
      case "peakConcurrentRequests":
        return "峰值并发请求数"
      default:
        return metric
    }
  }

  // 获取警报严重性徽章
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            信息
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            警告
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            错误
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            严重
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // 准备错误分布图表数据
  const prepareErrorDistributionData = () => {
    if (!advancedMetrics || !advancedMetrics.errorDistribution) {
      return []
    }

    return Object.entries(advancedMetrics.errorDistribution).map(([type, count]) => ({
      name: type,
      value: count,
    }))
  }

  // 准备端点成功率图表数据
  const prepareEndpointSuccessRateData = () => {
    if (!advancedMetrics || !advancedMetrics.successRateByEndpoint) {
      return []
    }

    return Object.entries(advancedMetrics.successRateByEndpoint).map(([endpoint, rate]) => ({
      name: endpoint,
      rate,
    }))
  }

  // 准备端点响应时间图表数据
  const prepareEndpointResponseTimeData = () => {
    if (!advancedMetrics || !advancedMetrics.responseTimeByEndpoint) {
      return []
    }

    return Object.entries(advancedMetrics.responseTimeByEndpoint).map(([endpoint, time]) => ({
      name: endpoint,
      time,
    }))
  }

  // 图表颜色
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">高级API监控</h2>
          <p className="text-muted-foreground">监控API的详细指标和设置自定义警报规则</p>
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
              高级指标
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Bell className="h-4 w-4 mr-2" />
              警报规则
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              警报历史
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              监控设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">95%响应时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {advancedMetrics?.responseTimeP95.toFixed(0) || 0} ms
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">99%响应时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {advancedMetrics?.responseTimeP99.toFixed(0) || 0} ms
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">请求频率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {advancedMetrics?.requestsPerMinute.toFixed(2) || 0} 请求/分钟
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>错误分布</CardTitle>
                  <CardDescription>各类型错误的分布情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {prepareErrorDistributionData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={prepareErrorDistributionData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {prepareErrorDistributionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">暂无错误数据</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>端点成功率</CardTitle>
                  <CardDescription>各端点的请求成功率</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {prepareEndpointSuccessRateData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={prepareEndpointSuccessRateData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip />
                          <Bar dataKey="rate" name="成功率 (%)" fill="#8884d8" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">暂无端点数据</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>端点响应时间</CardTitle>
                <CardDescription>各端点的平均响应时间</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {prepareEndpointResponseTimeData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={prepareEndpointResponseTimeData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="time" name="响应时间 (ms)" fill="#82ca9d" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">暂无端点数据</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts"\

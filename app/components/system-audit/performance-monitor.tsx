"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, FileDown, TrendingUp, Zap, Clock, AlertCircle, CheckCircle, Filter } from "lucide-react"
import type { RepairHistory } from "./repair-history"
import type { ProblemType } from "./auto-fix-engine"

// 绘图用的颜色常量
const CHART_COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  gray: "#6b7280",
  framework: "#8b5cf6",
  fileCompliance: "#3b82f6",
  interaction: "#10b981",
  missingFeature: "#f59e0b",
}

// 性能数据类型
interface PerformanceMetrics {
  // 修复效率指标
  averageFixTime: number // 平均修复时间（秒）
  medianFixTime: number // 中位数修复时间（秒）
  fastestFixTime: number // 最快修复时间（秒）
  slowestFixTime: number // 最慢修复时间（秒）

  // 修复成功指标
  overallSuccessRate: number // 总体修复成功率
  successRateByType: Record<ProblemType, number> // 各类型问题修复成功率
  problemTypeDistribution: Record<ProblemType, number> // 问题类型分布

  // 趋势指标
  fixTimeHistory: { date: Date; time: number }[] // 修复时间历史
  successRateHistory: { date: Date; rate: number }[] // 成功率历史
  healthScoreImprovement: { date: Date; improvement: number }[] // 健康度提升历史

  // 资源使用指标（模拟数据）
  cpuUsageAvg: number // 平均CPU使用率
  memoryUsageAvg: number // 平均内存使用率

  // 瓶颈分析
  slowestProblemTypes: { type: ProblemType; time: number }[] // 最慢的问题类型
  lowestSuccessTypes: { type: ProblemType; rate: number }[] // 成功率最低的问题类型
}

interface PerformanceMonitorProps {
  histories: RepairHistory[]
  onExportReport: () => void
}

export function PerformanceMonitor({ histories, onExportReport }: PerformanceMonitorProps) {
  const [timeRange, setTimeRange] = useState<"all" | "week" | "month" | "quarter">("month")
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [filteredHistories, setFilteredHistories] = useState<RepairHistory[]>([])

  // 根据选择的时间范围过滤历史记录
  useEffect(() => {
    if (histories.length === 0) {
      setFilteredHistories([])
      return
    }

    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "all":
      default:
        startDate = new Date(0) // 从开始时间算起
        break
    }

    const filtered = histories.filter((history) => history.timestamp >= startDate)
    setFilteredHistories(filtered)
  }, [histories, timeRange])

  // 计算性能指标
  useEffect(() => {
    if (filteredHistories.length === 0) {
      setMetrics(null)
      return
    }

    // 计算修复时间相关指标
    const fixTimes = filteredHistories.map((h) => h.duration)
    fixTimes.sort((a, b) => a - b)

    const averageFixTime = fixTimes.reduce((sum, time) => sum + time, 0) / fixTimes.length
    const medianFixTime = fixTimes[Math.floor(fixTimes.length / 2)]
    const fastestFixTime = fixTimes[0]
    const slowestFixTime = fixTimes[fixTimes.length - 1]

    // 计算成功率指标
    const totalProblems = filteredHistories.reduce((sum, h) => sum + h.totalCount, 0)
    const fixedProblems = filteredHistories.reduce((sum, h) => sum + h.fixedCount, 0)
    const overallSuccessRate = totalProblems > 0 ? (fixedProblems / totalProblems) * 100 : 0

    // 按问题类型统计
    const problemsByType: Record<ProblemType, { total: number; fixed: number }> = {
      framework: { total: 0, fixed: 0 },
      fileCompliance: { total: 0, fixed: 0 },
      interaction: { total: 0, fixed: 0 },
      missingFeature: { total: 0, fixed: 0 },
    }

    // 统计每种类型的问题数量和修复成功数量
    filteredHistories.forEach((history) => {
      history.problems.forEach((problem) => {
        problemsByType[problem.type].total += 1
        if (problem.status === "fixed") {
          problemsByType[problem.type].fixed += 1
        }
      })
    })

    // 计算每种类型的成功率
    const successRateByType: Record<ProblemType, number> = {} as Record<ProblemType, number>
    const problemTypeDistribution: Record<ProblemType, number> = {} as Record<ProblemType, number>

    Object.entries(problemsByType).forEach(([type, data]) => {
      successRateByType[type as ProblemType] = data.total > 0 ? (data.fixed / data.total) * 100 : 0
      problemTypeDistribution[type as ProblemType] = data.total
    })

    // 生成趋势数据
    const sortedHistories = [...filteredHistories].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    const fixTimeHistory = sortedHistories.map((h) => ({
      date: h.timestamp,
      time: h.duration,
    }))

    const successRateHistory = sortedHistories.map((h) => ({
      date: h.timestamp,
      rate: h.totalCount > 0 ? (h.fixedCount / h.totalCount) * 100 : 0,
    }))

    const healthScoreImprovement = sortedHistories.map((h) => ({
      date: h.timestamp,
      improvement: h.systemHealthAfter - h.systemHealthBefore,
    }))

    // 计算瓶颈指标
    const problemTypeFixTimes: Record<ProblemType, number[]> = {
      framework: [],
      fileCompliance: [],
      interaction: [],
      missingFeature: [],
    }

    // 收集每种类型的修复时间数据（假设每个问题的修复时间相等）
    filteredHistories.forEach((history) => {
      const timePerProblem = history.totalCount > 0 ? history.duration / history.totalCount : 0

      history.problems.forEach((problem) => {
        problemTypeFixTimes[problem.type].push(timePerProblem)
      })
    })

    // 计算每种类型的平均修复时间
    const avgFixTimeByType: Record<string, number> = {}
    Object.entries(problemTypeFixTimes).forEach(([type, times]) => {
      if (times.length > 0) {
        avgFixTimeByType[type] = times.reduce((sum, time) => sum + time, 0) / times.length
      } else {
        avgFixTimeByType[type] = 0
      }
    })

    // 找出最慢的问题类型
    const slowestProblemTypes = Object.entries(avgFixTimeByType)
      .map(([type, time]) => ({ type: type as ProblemType, time }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 2)

    // 找出成功率最低的问题类型
    const lowestSuccessTypes = Object.entries(successRateByType)
      .map(([type, rate]) => ({ type: type as ProblemType, rate }))
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 2)

    // 模拟资源使用数据
    const cpuUsageAvg = 30 + Math.floor(Math.random() * 20) // 30%-50%
    const memoryUsageAvg = 40 + Math.floor(Math.random() * 30) // 40%-70%

    // 设置计算好的指标
    setMetrics({
      averageFixTime,
      medianFixTime,
      fastestFixTime,
      slowestFixTime,
      overallSuccessRate,
      successRateByType,
      problemTypeDistribution,
      fixTimeHistory,
      successRateHistory,
      healthScoreImprovement,
      cpuUsageAvg,
      memoryUsageAvg,
      slowestProblemTypes,
      lowestSuccessTypes,
    })
  }, [filteredHistories])

  // 获取问题类型的中文名称
  const getProblemTypeName = (type: ProblemType): string => {
    switch (type) {
      case "framework":
        return "框架完整性"
      case "fileCompliance":
        return "文件合规性"
      case "interaction":
        return "交互流畅性"
      case "missingFeature":
        return "缺失功能"
      default:
        return "未知类型"
    }
  }

  // 格式化时间显示（秒）
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}秒`
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.round(seconds % 60)
      return `${minutes}分${remainingSeconds}秒`
    }
  }

  // 格式化日期显示
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 渲染折线图（使用模拟方法）
  const renderLineChart = (data: { date: Date; value: number }[], label: string, color: string) => {
    if (!data || data.length === 0) return <div className="text-center text-muted-foreground">暂无数据</div>

    const maxValue = Math.max(...data.map((d) => d.value))
    const normalizedData = data.map((d, index) => ({
      x: index,
      y: (d.value / maxValue) * 100,
      date: d.date,
      value: d.value,
    }))

    return (
      <div className="w-full h-[150px] mt-2 relative">
        <div className="h-full flex items-end justify-start">
          {normalizedData.map((point, index) => (
            <div key={index} className="group relative h-full flex flex-col justify-end items-center mx-[2px] flex-1">
              <div
                className="tooltip-content absolute bottom-full mb-2 bg-primary text-primary-foreground 
                           text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none
                           transition-opacity whitespace-nowrap z-10"
              >
                {formatDate(point.date)}:{" "}
                {label === "成功率"
                  ? `${point.value.toFixed(1)}%`
                  : label === "修复时间"
                    ? formatTime(point.value)
                    : `${point.value > 0 ? "+" : ""}${point.value.toFixed(1)}%`}
              </div>
              <div
                className="w-full bg-primary/80 hover:bg-primary transition-all rounded-t-sm"
                style={{
                  height: `${Math.max(point.y, 3)}%`,
                  backgroundColor: color,
                }}
              />
              {index % Math.ceil(normalizedData.length / 5) === 0 && (
                <span className="text-[10px] text-muted-foreground mt-1 rotate-0 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {formatDate(point.date).split(" ")[0]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Y轴标签 */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none">
          <span className="text-[10px] text-muted-foreground">
            {label === "修复时间" ? formatTime(maxValue) : `${maxValue.toFixed(0)}${label === "成功率" ? "%" : ""}`}
          </span>
          <span className="text-[10px] text-muted-foreground">{label === "修复时间" ? "0秒" : "0"}</span>
        </div>
      </div>
    )
  }

  // 渲染饼图（使用模拟方法）
  const renderPieChart = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0)
    if (total === 0) return <div className="text-center text-muted-foreground">暂无数据</div>

    const segments = Object.entries(data).map(([key, value]) => ({
      type: key as ProblemType,
      percentage: (value / total) * 100,
      color: CHART_COLORS[key as keyof typeof CHART_COLORS] || CHART_COLORS.gray,
    }))

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-32 relative rounded-full overflow-hidden mb-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{total}</span>
          </div>

          {/* 生成饼图扇形 - 简单模拟，实际应用中应使用Canvas或SVG */}
          {segments.map((segment, index) => {
            const prevAngle = segments.slice(0, index).reduce((sum, s) => sum + (s.percentage / 100) * 360, 0)
            const angle = (segment.percentage / 100) * 360

            return (
              <div
                key={segment.type}
                className="absolute inset-0 tooltip-trigger"
                style={{
                  background: `conic-gradient(${segment.color} ${prevAngle}deg, ${segment.color} ${prevAngle + angle}deg, transparent ${prevAngle + angle}deg)`,
                }}
                title={`${getProblemTypeName(segment.type)}: ${segment.percentage.toFixed(1)}%`}
              />
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          {segments.map((segment) => (
            <div key={segment.type} className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: segment.color }} />
              <span className="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                {getProblemTypeName(segment.type).length > 4
                  ? getProblemTypeName(segment.type).substring(0, 4) + ".."
                  : getProblemTypeName(segment.type)}
              </span>
              <span className="ml-1 font-medium">{segment.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 渲染性能概览卡片
  const renderOverviewCard = () => {
    if (!metrics) return <div className="text-center p-8 text-muted-foreground">暂无性能数据</div>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              修复时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">平均时间</span>
                <span className="font-medium">{formatTime(metrics.averageFixTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">中位数</span>
                <span className="font-medium">{formatTime(metrics.medianFixTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">最快</span>
                <span className="font-medium text-green-600">{formatTime(metrics.fastestFixTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">最慢</span>
                <span className="font-medium text-yellow-600">{formatTime(metrics.slowestFixTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
              修复成功率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">总体成功率</span>
                <span
                  className={`font-medium ${
                    metrics.overallSuccessRate >= 90
                      ? "text-green-600"
                      : metrics.overallSuccessRate >= 75
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {metrics.overallSuccessRate.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-1 mt-2">
                {Object.entries(metrics.successRateByType).map(([type, rate]) => (
                  <div key={type} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{getProblemTypeName(type as ProblemType)}</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                        <div
                          className={`h-full rounded-full ${
                            rate >= 90 ? "bg-green-500" : rate >= 75 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="font-medium">{rate.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
              问题类型分布
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {metrics.problemTypeDistribution && renderPieChart(metrics.problemTypeDistribution)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
              性能瓶颈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">最慢问题类型</h4>
                {metrics.slowestProblemTypes.length > 0 ? (
                  <div className="space-y-1">
                    {metrics.slowestProblemTypes.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{getProblemTypeName(item.type)}</span>
                        <span className="font-medium">{formatTime(item.time)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">暂无数据</span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">最低成功率</h4>
                {metrics.lowestSuccessTypes.length > 0 ? (
                  <div className="space-y-1">
                    {metrics.lowestSuccessTypes.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{getProblemTypeName(item.type)}</span>
                        <span
                          className={`font-medium ${
                            item.rate >= 90 ? "text-green-600" : item.rate >= 75 ? "text-yellow-600" : "text-red-600"
                          }`}
                        >
                          {item.rate.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">暂无数据</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染趋势图表
  const renderTrendsCard = () => {
    if (!metrics) return <div className="text-center p-8 text-muted-foreground">暂无趋势数据</div>

    // 转换数据格式以适应图表组件
    const fixTimeData = metrics.fixTimeHistory.map((item) => ({ date: item.date, value: item.time }))
    const successRateData = metrics.successRateHistory.map((item) => ({ date: item.date, value: item.rate }))
    const healthImprovementData = metrics.healthScoreImprovement.map((item) => ({
      date: item.date,
      value: item.improvement,
    }))

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                修复时间趋势
              </CardTitle>
              <div className="text-xs text-muted-foreground">单位: 秒</div>
            </div>
          </CardHeader>
          <CardContent>{renderLineChart(fixTimeData, "修复时间", CHART_COLORS.purple)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
              成功率趋势
            </CardTitle>
          </CardHeader>
          <CardContent>{renderLineChart(successRateData, "成功率", CHART_COLORS.green)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
              健康度提升趋势
            </CardTitle>
          </CardHeader>
          <CardContent>{renderLineChart(healthImprovementData, "健康度提升", CHART_COLORS.blue)}</CardContent>
        </Card>
      </div>
    )
  }

  // 渲染性能优化建议
  const renderOptimizationCard = () => {
    if (!metrics) return <div className="text-center p-8 text-muted-foreground">暂无数据可进行分析</div>

    // 根据性能指标给出优化建议
    const suggestions = []

    // 1. 修复时间过长的问题类型
    if (metrics.slowestProblemTypes.length > 0 && metrics.slowestProblemTypes[0].time > metrics.averageFixTime * 1.5) {
      suggestions.push({
        title: `优化"${getProblemTypeName(metrics.slowestProblemTypes[0].type)}"问题的修复流程`,
        description: `该类型问题修复时间（${formatTime(metrics.slowestProblemTypes[0].time)}）显著高于平均水平，考虑优化修复算法或增加资源分配。`,
        priority: "high",
      })
    }

    // 2. 低成功率问题
    const lowestSuccessType = Object.entries(metrics.successRateByType).sort(([, a], [, b]) => a - b)[0]

    if (lowestSuccessType && lowestSuccessType[1] < 70) {
      suggestions.push({
        title: `提高"${getProblemTypeName(lowestSuccessType[0] as ProblemType)}"问题的修复成功率`,
        description: `该类型问题当前成功率仅为${lowestSuccessType[1].toFixed(1)}%，远低于系统平均水平。建议分析失败原因并改进修复策略。`,
        priority: "high",
      })
    }

    // 3. 资源使用优化
    if (metrics.cpuUsageAvg > 40) {
      suggestions.push({
        title: "优化CPU资源使用",
        description: `当前修复过程平均CPU使用率为${metrics.cpuUsageAvg}%，考虑优化算法或实施批处理减轻负载。`,
        priority: "medium",
      })
    }

    // 4. 通用优化建议
    if (suggestions.length < 3) {
      suggestions.push({
        title: "实施并行修复策略",
        description: "对互不依赖的问题实施并行修复，可能显著减少总体修复时间。",
        priority: "medium",
      })

      suggestions.push({
        title: "建立问题修复知识库",
        description: "根据历史修复数据，建立问题类型与最佳修复方法的映射，提高首次修复成功率。",
        priority: "medium",
      })
    }

    return (
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-medium">{suggestion.title}</CardTitle>
                <Badge variant={suggestion.priority === "high" ? "destructive" : "outline"}>
                  {suggestion.priority === "high" ? "高优先级" : "中优先级"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </CardContent>
          </Card>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center p-6 text-muted-foreground">当前没有明显的性能问题，系统运行良好</div>
        )}
      </div>
    )
  }

  // 渲染资源使用卡片
  const renderResourcesCard = () => {
    if (!metrics) return <div className="text-center p-8 text-muted-foreground">暂无资源使用数据</div>

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
              资源利用率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">CPU 使用率 (平均)</span>
                  <span className="text-sm font-medium">{metrics.cpuUsageAvg}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metrics.cpuUsageAvg > 80
                        ? "bg-red-500"
                        : metrics.cpuUsageAvg > 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${metrics.cpuUsageAvg}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">内存使用率 (平均)</span>
                  <span className="text-sm font-medium">{metrics.memoryUsageAvg}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metrics.memoryUsageAvg > 80
                        ? "bg-red-500"
                        : metrics.memoryUsageAvg > 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${metrics.memoryUsageAvg}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">资源使用分析</h4>
              <p className="text-sm text-muted-foreground">
                {metrics.cpuUsageAvg > 60 || metrics.memoryUsageAvg > 70
                  ? "系统资源使用率较高，可能影响修复性能。建议优化资源密集型操作或增加系统资源。"
                  : "系统资源使用在合理范围内，修复过程资源分配充足。"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">修复效率分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">问题类型与修复效率</h4>
                <div className="space-y-2">
                  {metrics.slowestProblemTypes.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{getProblemTypeName(item.type)}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{formatTime(item.time)}/问题</span>
                        <Badge
                          variant="outline"
                          className={
                            item.time > metrics.averageFixTime * 1.5
                              ? "text-red-600 bg-red-50"
                              : item.time > metrics.averageFixTime
                                ? "text-yellow-600 bg-yellow-50"
                                : "text-green-600 bg-green-50"
                          }
                        >
                          {item.time > metrics.averageFixTime * 1.5
                            ? "慢"
                            : item.time > metrics.averageFixTime
                              ? "一般"
                              : "快"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">修复效率评分</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {Math.round(
                      (metrics.overallSuccessRate / 100) * 70 + // 成功率权重70%
                        (1 - metrics.averageFixTime / (metrics.slowestFixTime || 1)) * 30, // 时间效率权重30%
                    )}
                    <span className="text-sm text-muted-foreground ml-1">/ 100</span>
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      metrics.overallSuccessRate > 85 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }
                  >
                    {metrics.overallSuccessRate > 85 ? "良好" : "待优化"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center text-xl">
              <BarChart className="mr-2 h-5 w-5" />
              修复性能监控与分析
            </CardTitle>
            <CardDescription>深入分析系统修复性能指标，发现优化机会</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="选择时间范围" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">最近一周</SelectItem>
                <SelectItem value="month">最近一个月</SelectItem>
                <SelectItem value="quarter">最近三个月</SelectItem>
                <SelectItem value="all">全部数据</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredHistories.length === 0 ? (
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无性能数据</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              尚未收集到修复性能数据。请先运行系统审查并使用自动修复功能，系统会自动记录性能指标。
            </p>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overview">性能概览</TabsTrigger>
              <TabsTrigger value="trends">趋势分析</TabsTrigger>
              <TabsTrigger value="resources">资源使用</TabsTrigger>
              <TabsTrigger value="optimization">优化建议</TabsTrigger>
              <TabsTrigger value="comparison">比较分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">{renderOverviewCard()}</TabsContent>

            <TabsContent value="trends">{renderTrendsCard()}</TabsContent>

            <TabsContent value="resources">{renderResourcesCard()}</TabsContent>

            <TabsContent value="optimization">{renderOptimizationCard()}</TabsContent>

            <TabsContent value="comparison">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">问题类型修复时间比较</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px] flex items-center justify-center">
                      {metrics ? (
                        <div className="w-full">
                          {Object.entries(metrics.successRateByType).map(([type, _]) => {
                            const typeProblem = metrics.slowestProblemTypes.find((p) => p.type === type) || {
                              type: type as ProblemType,
                              time: 0,
                            }
                            const percentage = (typeProblem.time / (metrics.slowestFixTime || 1)) * 100

                            return (
                              <div key={type} className="mb-4">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">{getProblemTypeName(type as ProblemType)}</span>
                                  <span className="text-sm font-medium">{formatTime(typeProblem.time)}</span>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor:
                                        CHART_COLORS[type as keyof typeof CHART_COLORS] || CHART_COLORS.gray,
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">暂无数据</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">问题类型成功率比较</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px] flex items-center justify-center">
                      {metrics ? (
                        <div className="w-full">
                          {Object.entries(metrics.successRateByType).map(([type, rate]) => (
                            <div key={type} className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{getProblemTypeName(type as ProblemType)}</span>
                                <span className="text-sm font-medium">{rate.toFixed(1)}%</span>
                              </div>
                              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${rate}%`,
                                    backgroundColor:
                                      CHART_COLORS[type as keyof typeof CHART_COLORS] || CHART_COLORS.gray,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">暂无数据</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">基于 {filteredHistories.length} 次修复操作的数据分析</div>
        <Button variant="outline" size="sm" onClick={onExportReport} disabled={filteredHistories.length === 0}>
          <FileDown className="mr-2 h-4 w-4" />
          导出性能报告
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, RefreshCw, Clock, AlertTriangle } from "lucide-react"
import type { Problem } from "./auto-fix-engine"

interface MLPredictionProps {
  problems: Problem[]
  onPredictionComplete?: (predictions: any[]) => void
}

export function MLPrediction({ problems, onPredictionComplete }: MLPredictionProps) {
  const [predictions, setPredictions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // 获取预测
  const fetchPredictions = async () => {
    if (problems.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ml/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problems,
          predictionType: "all",
        }),
      })

      if (!response.ok) {
        throw new Error(`预测请求失败: ${response.status}`)
      }

      const data = await response.json()
      setPredictions(data.predictions)
      setLastUpdated(new Date())

      // 回调
      if (onPredictionComplete) {
        onPredictionComplete(data.predictions)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取预测时出错")
      console.error("预测错误:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载和问题变化时获取预测
  useEffect(() => {
    if (problems.length > 0) {
      fetchPredictions()
    }
  }, [problems])

  // 格式化时间（秒）
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(0)}秒`
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.round(seconds % 60)
      return `${minutes}分${remainingSeconds}秒`
    }
  }

  // 获取问题类型的中文名称
  const getProblemTypeName = (type: string): string => {
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

  // 获取问题严重程度的中文名称
  const getSeverityName = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "严重"
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return "未知"
    }
  }

  // 获取成功率的颜色类
  const getSuccessRateColorClass = (rate: number): string => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  // 获取预测的问题
  const getProblemById = (id: string): Problem | undefined => {
    return problems.find((p) => p.id === id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              机器学习预测
            </CardTitle>
            <CardDescription>基于历史数据预测修复成功率和所需时间</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchPredictions} disabled={isLoading || problems.length === 0}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            刷新预测
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">加载预测...</span>
              <span className="text-sm font-medium">50%</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            <AlertTriangle className="inline-block mr-2 h-4 w-4" />
            获取预测时出错: {error}
          </div>
        )}

        {predictions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>问题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>严重程度</TableHead>
                <TableHead className="text-right">预计成功率</TableHead>
                <TableHead className="text-right">预计时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction) => {
                const problem = getProblemById(prediction.problemId)
                if (!problem) return null

                return (
                  <TableRow key={prediction.problemId}>
                    <TableCell className="font-medium">{problem.name}</TableCell>
                    <TableCell>{getProblemTypeName(problem.type)}</TableCell>
                    <TableCell>
                      {problem.severity && (
                        <Badge
                          variant="outline"
                          className={
                            problem.severity === "critical" || problem.severity === "high"
                              ? "bg-red-50 text-red-700"
                              : problem.severity === "medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-green-50 text-green-700"
                          }
                        >
                          {getSeverityName(problem.severity)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                          <div
                            className={`h-full rounded-full ${
                              prediction.successRate >= 90
                                ? "bg-green-500"
                                : prediction.successRate >= 75
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${prediction.successRate}%` }}
                          />
                        </div>
                        <span className={getSuccessRateColorClass(prediction.successRate)}>
                          {prediction.successRate.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {formatTime(prediction.repairTime)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : !isLoading && problems.length > 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>暂无预测数据</p>
            <p className="text-sm">点击"刷新预测"按钮获取预测结果</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>请先选择需要预测的问题</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>预测基于历史修复数据和问题特征</div>
        {lastUpdated && <div>上次更新: {lastUpdated.toLocaleString()}</div>}
      </CardFooter>
    </Card>
  )
}

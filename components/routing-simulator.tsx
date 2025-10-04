"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Play, RotateCcw, Download } from "lucide-react"

interface SimulationRequest {
  userTier: string
  requestType: string
  modelType: string
  contentLength: number
  timeOfDay: string
  region: string
  costLimit: number
  responseTimeRequirement: number
}

interface SimulationResult {
  selectedProvider: string
  selectedModel?: string
  fallbackProvider?: string
  matchedRule?: string
  reasoning: string[]
  estimatedCost: number
  estimatedResponseTime: number
}

interface RoutingSimulatorProps {
  providers: Array<{ id: string; name: string }>
  rules: Array<{
    id: string
    name: string
    conditions: Array<{ field: string; operator: string; value: string }>
    action: { providerId: string; model?: string; fallbackProviderId?: string }
    enabled: boolean
    priority: number
  }>
}

export function RoutingSimulator({ providers, rules }: RoutingSimulatorProps) {
  const { toast } = useToast()

  const [request, setRequest] = useState<SimulationRequest>({
    userTier: "premium",
    requestType: "chat",
    modelType: "gpt-4",
    contentLength: 500,
    timeOfDay: "morning",
    region: "asia",
    costLimit: 10,
    responseTimeRequirement: 2000,
  })

  const [result, setResult] = useState<SimulationResult | null>(null)
  const [simulationHistory, setSimulationHistory] = useState<
    Array<{
      request: SimulationRequest
      result: SimulationResult
      timestamp: string
    }>
  >([])

  const simulateRouting = () => {
    // 模拟路由决策逻辑
    const enabledRules = rules.filter((rule) => rule.enabled).sort((a, b) => a.priority - b.priority)

    let matchedRule: any = null
    let reasoning: string[] = []

    // 检查每个规则
    for (const rule of enabledRules) {
      let ruleMatches = true
      const ruleReasons: string[] = []

      for (const condition of rule.conditions) {
        const fieldValue = getFieldValue(request, condition.field)
        const conditionMet = evaluateCondition(fieldValue, condition.operator, condition.value)

        if (conditionMet) {
          ruleReasons.push(
            `✓ ${getFieldLabel(condition.field)} ${getOperatorLabel(condition.operator)} ${condition.value}`,
          )
        } else {
          ruleReasons.push(
            `✗ ${getFieldLabel(condition.field)} ${getOperatorLabel(condition.operator)} ${condition.value}`,
          )
          ruleMatches = false
        }
      }

      if (ruleMatches) {
        matchedRule = rule
        reasoning = [
          `匹配规则: ${rule.name}`,
          ...ruleReasons,
          `选择提供商: ${providers.find((p) => p.id === rule.action.providerId)?.name || rule.action.providerId}`,
        ]
        break
      }
    }

    // 如果没有匹配的规则，使用默认规则
    if (!matchedRule) {
      const defaultRule = enabledRules.find((rule) => rule.conditions.length === 0)
      if (defaultRule) {
        matchedRule = defaultRule
        reasoning = [
          "没有匹配的条件规则",
          `使用默认规则: ${defaultRule.name}`,
          `选择提供商: ${providers.find((p) => p.id === defaultRule.action.providerId)?.name || defaultRule.action.providerId}`,
        ]
      } else {
        // 如果连默认规则都没有，选择第一个可用的提供商
        const firstProvider = providers[0]
        reasoning = [
          "没有匹配的规则",
          "没有配置默认规则",
          `选择第一个可用提供商: ${firstProvider?.name || "无可用提供商"}`,
        ]
        matchedRule = {
          action: { providerId: firstProvider?.id || "" },
        }
      }
    }

    const selectedProvider = providers.find((p) => p.id === matchedRule.action.providerId)
    const fallbackProvider = matchedRule.action.fallbackProviderId
      ? providers.find((p) => p.id === matchedRule.action.fallbackProviderId)
      : undefined

    const simulationResult: SimulationResult = {
      selectedProvider: selectedProvider?.name || "未知提供商",
      selectedModel: matchedRule.action.model,
      fallbackProvider: fallbackProvider?.name,
      matchedRule: matchedRule.name || "默认规则",
      reasoning,
      estimatedCost: Math.random() * 5 + 1, // 模拟成本
      estimatedResponseTime: Math.random() * 1000 + 500, // 模拟响应时间
    }

    setResult(simulationResult)

    // 添加到历史记录
    setSimulationHistory([
      {
        request: { ...request },
        result: simulationResult,
        timestamp: new Date().toISOString(),
      },
      ...simulationHistory.slice(0, 9), // 保留最近10条记录
    ])

    toast({
      title: "路由模拟完成",
      description: `选择了提供商: ${simulationResult.selectedProvider}`,
    })
  }

  const getFieldValue = (req: SimulationRequest, field: string): any => {
    switch (field) {
      case "user_tier":
        return req.userTier
      case "request_type":
        return req.requestType
      case "model_type":
        return req.modelType
      case "content_length":
        return req.contentLength
      case "time_of_day":
        return req.timeOfDay
      case "region":
        return req.region
      case "cost_limit":
        return req.costLimit
      case "response_time_requirement":
        return req.responseTimeRequirement
      default:
        return ""
    }
  }

  const evaluateCondition = (fieldValue: any, operator: string, conditionValue: string): boolean => {
    switch (operator) {
      case "equals":
        return fieldValue.toString() === conditionValue
      case "not_equals":
        return fieldValue.toString() !== conditionValue
      case "greater_than":
        return Number(fieldValue) > Number(conditionValue)
      case "less_than":
        return Number(fieldValue) < Number(conditionValue)
      case "contains":
        return fieldValue.toString().includes(conditionValue)
      case "not_contains":
        return !fieldValue.toString().includes(conditionValue)
      default:
        return false
    }
  }

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      user_tier: "用户等级",
      request_type: "请求类型",
      model_type: "模型类型",
      content_length: "内容长度",
      time_of_day: "时间段",
      region: "地区",
      cost_limit: "成本限制",
      response_time_requirement: "响应时间要求",
    }
    return labels[field] || field
  }

  const getOperatorLabel = (operator: string): string => {
    const labels: Record<string, string> = {
      equals: "等于",
      not_equals: "不等于",
      greater_than: "大于",
      less_than: "小于",
      contains: "包含",
      not_contains: "不包含",
    }
    return labels[operator] || operator
  }

  const resetSimulation = () => {
    setRequest({
      userTier: "premium",
      requestType: "chat",
      modelType: "gpt-4",
      contentLength: 500,
      timeOfDay: "morning",
      region: "asia",
      costLimit: 10,
      responseTimeRequirement: 2000,
    })
    setResult(null)
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(simulationHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `routing-simulation-history-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "历史记录已导出",
      description: "模拟历史记录已导出为JSON文件",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>模拟请求参数</CardTitle>
            <CardDescription>设置模拟请求的各种参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>用户等级</Label>
                <Select value={request.userTier} onValueChange={(value) => setRequest({ ...request, userTier: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">免费用户</SelectItem>
                    <SelectItem value="premium">高级用户</SelectItem>
                    <SelectItem value="enterprise">企业用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>请求类型</Label>
                <Select
                  value={request.requestType}
                  onValueChange={(value) => setRequest({ ...request, requestType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">聊天对话</SelectItem>
                    <SelectItem value="completion">文本补全</SelectItem>
                    <SelectItem value="embedding">文本嵌入</SelectItem>
                    <SelectItem value="image">图像生成</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>模型类型</Label>
                <Select
                  value={request.modelType}
                  onValueChange={(value) => setRequest({ ...request, modelType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude-3">Claude-3</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>时间段</Label>
                <Select
                  value={request.timeOfDay}
                  onValueChange={(value) => setRequest({ ...request, timeOfDay: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">上午</SelectItem>
                    <SelectItem value="afternoon">下午</SelectItem>
                    <SelectItem value="evening">晚上</SelectItem>
                    <SelectItem value="night">深夜</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>地区</Label>
                <Select value={request.region} onValueChange={(value) => setRequest({ ...request, region: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia">亚洲</SelectItem>
                    <SelectItem value="europe">欧洲</SelectItem>
                    <SelectItem value="america">美洲</SelectItem>
                    <SelectItem value="oceania">大洋洲</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>内容长度</Label>
                <Input
                  type="number"
                  value={request.contentLength}
                  onChange={(e) => setRequest({ ...request, contentLength: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>成本限制 (¥)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={request.costLimit}
                  onChange={(e) => setRequest({ ...request, costLimit: Number.parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>响应时间要求 (ms)</Label>
                <Input
                  type="number"
                  value={request.responseTimeRequirement}
                  onChange={(e) => setRequest({ ...request, responseTimeRequirement: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={simulateRouting} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                运行模拟
              </Button>
              <Button variant="outline" onClick={resetSimulation}>
                <RotateCcw className="h-4 w-4 mr-2" />
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>模拟结果</CardTitle>
            <CardDescription>路由决策结果和推理过程</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium">选择的提供商</Label>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {result.selectedProvider}
                      </Badge>
                      {result.selectedModel && (
                        <Badge variant="outline" className="ml-2">
                          {result.selectedModel}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {result.fallbackProvider && (
                    <div>
                      <Label className="text-sm font-medium">备用提供商</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{result.fallbackProvider}</Badge>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">匹配规则</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{result.matchedRule}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">预估成本</Label>
                      <div className="text-lg font-semibold">¥{result.estimatedCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">预估响应时间</Label>
                      <div className="text-lg font-semibold">{result.estimatedResponseTime.toFixed(0)}ms</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">决策推理</Label>
                  <div className="mt-2 space-y-1">
                    {result.reasoning.map((reason, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">点击"运行模拟"查看路由决策结果</div>
            )}
          </CardContent>
        </Card>
      </div>

      {simulationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>模拟历史</CardTitle>
                <CardDescription>最近的模拟记录</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={exportHistory}>
                <Download className="h-4 w-4 mr-2" />
                导出历史
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simulationHistory.slice(0, 5).map((record, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {record.result.selectedProvider}
                      </Badge>
                      {record.result.selectedModel && (
                        <Badge variant="outline" className="text-xs">
                          {record.result.selectedModel}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(record.timestamp).toLocaleString("zh-CN")}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    用户: {record.request.userTier} | 类型: {record.request.requestType} | 成本: ¥
                    {record.result.estimatedCost.toFixed(2)} | 响应时间:{" "}
                    {record.result.estimatedResponseTime.toFixed(0)}ms
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

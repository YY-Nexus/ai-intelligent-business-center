"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Play, Pause, BarChart3, Settings } from "lucide-react"

interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "paused" | "completed"
  variants: ABTestVariant[]
  metrics: ABTestMetrics
  startDate?: string
  endDate?: string
  totalRequests: number
}

interface ABTestVariant {
  id: string
  name: string
  providerId: string
  trafficPercentage: number
  requests: number
  successRate: number
  avgResponseTime: number
  cost: number
}

interface ABTestMetrics {
  totalRequests: number
  avgResponseTime: number
  successRate: number
  totalCost: number
}

interface ABTestingConfigProps {
  providers: Array<{ id: string; name: string }>
}

export function ABTestingConfig({ providers }: ABTestingConfigProps) {
  const { toast } = useToast()

  const [tests, setTests] = useState<ABTest[]>([
    {
      id: "1",
      name: "GPT-4 vs Claude-3 性能测试",
      description: "比较GPT-4和Claude-3在代码生成任务上的表现",
      status: "running",
      startDate: "2024-01-15T00:00:00Z",
      totalRequests: 1250,
      variants: [
        {
          id: "v1",
          name: "GPT-4",
          providerId: "openai",
          trafficPercentage: 50,
          requests: 625,
          successRate: 98.2,
          avgResponseTime: 1200,
          cost: 15.75,
        },
        {
          id: "v2",
          name: "Claude-3",
          providerId: "anthropic",
          trafficPercentage: 50,
          requests: 625,
          successRate: 97.8,
          avgResponseTime: 980,
          cost: 12.3,
        },
      ],
      metrics: {
        totalRequests: 1250,
        avgResponseTime: 1090,
        successRate: 98.0,
        totalCost: 28.05,
      },
    },
  ])

  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    variants: [
      { providerId: "", trafficPercentage: 50 },
      { providerId: "", trafficPercentage: 50 },
    ],
  })

  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreateTest = () => {
    if (!newTest.name || newTest.variants.some((v) => !v.providerId)) {
      toast({
        title: "请填写完整信息",
        description: "测试名称和提供商都是必填项",
        variant: "destructive",
      })
      return
    }

    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name,
      description: newTest.description,
      status: "draft",
      totalRequests: 0,
      variants: newTest.variants.map((v, index) => ({
        id: `v${index + 1}`,
        name: providers.find((p) => p.id === v.providerId)?.name || v.providerId,
        providerId: v.providerId,
        trafficPercentage: v.trafficPercentage,
        requests: 0,
        successRate: 0,
        avgResponseTime: 0,
        cost: 0,
      })),
      metrics: {
        totalRequests: 0,
        avgResponseTime: 0,
        successRate: 0,
        totalCost: 0,
      },
    }

    setTests([...tests, test])
    setNewTest({
      name: "",
      description: "",
      variants: [
        { providerId: "", trafficPercentage: 50 },
        { providerId: "", trafficPercentage: 50 },
      ],
    })
    setShowCreateForm(false)

    toast({
      title: "A/B测试已创建",
      description: `测试"${test.name}"已成功创建`,
    })
  }

  const handleStartTest = (testId: string) => {
    setTests(tests.map((t) => (t.id === testId ? { ...t, status: "running", startDate: new Date().toISOString() } : t)))

    toast({
      title: "A/B测试已开始",
      description: "测试已开始运行，开始收集数据",
    })
  }

  const handlePauseTest = (testId: string) => {
    setTests(tests.map((t) => (t.id === testId ? { ...t, status: "paused" } : t)))

    toast({
      title: "A/B测试已暂停",
      description: "测试已暂停，可以随时恢复",
    })
  }

  const updateTrafficPercentage = (testIndex: number, variantIndex: number, percentage: number) => {
    const newVariants = [...newTest.variants]
    newVariants[variantIndex].trafficPercentage = percentage

    // 自动调整另一个变体的百分比
    if (newVariants.length === 2) {
      const otherIndex = variantIndex === 0 ? 1 : 0
      newVariants[otherIndex].trafficPercentage = 100 - percentage
    }

    setNewTest({ ...newTest, variants: newVariants })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      running: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    }

    const labels = {
      draft: "草稿",
      running: "运行中",
      paused: "已暂停",
      completed: "已完成",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">A/B测试配置</h3>
          <p className="text-sm text-muted-foreground">创建和管理AI提供商之间的A/B测试</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>创建新测试</Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>创建A/B测试</CardTitle>
            <CardDescription>设置新的A/B测试来比较不同AI提供商的性能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>测试名称</Label>
                <Input
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="输入测试名称"
                />
              </div>
              <div className="space-y-2">
                <Label>测试描述</Label>
                <Input
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  placeholder="输入测试描述"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>测试变体</Label>
              {newTest.variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">变体 {index + 1}</h4>
                    <Badge variant="outline">{variant.trafficPercentage}% 流量</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>AI提供商</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={variant.providerId}
                        onChange={(e) => {
                          const newVariants = [...newTest.variants]
                          newVariants[index].providerId = e.target.value
                          setNewTest({ ...newTest, variants: newVariants })
                        }}
                      >
                        <option value="">选择提供商</option>
                        {providers.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>流量分配 ({variant.trafficPercentage}%)</Label>
                      <Slider
                        value={[variant.trafficPercentage]}
                        onValueChange={(value) => updateTrafficPercentage(0, index, value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                取消
              </Button>
              <Button onClick={handleCreateTest}>创建测试</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {test.name}
                    {getStatusBadge(test.status)}
                  </CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {test.status === "draft" && (
                    <Button size="sm" onClick={() => handleStartTest(test.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      开始测试
                    </Button>
                  )}
                  {test.status === "running" && (
                    <Button size="sm" variant="outline" onClick={() => handlePauseTest(test.id)}>
                      <Pause className="h-4 w-4 mr-2" />
                      暂停测试
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    查看报告
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    设置
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{test.totalRequests.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">总请求数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{test.metrics.avgResponseTime}ms</div>
                    <div className="text-sm text-muted-foreground">平均响应时间</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{test.metrics.successRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">成功率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">¥{test.metrics.totalCost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">总成本</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">变体性能对比</h4>
                  {test.variants.map((variant) => (
                    <div key={variant.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{variant.name}</h5>
                          <Badge variant="outline">{variant.trafficPercentage}% 流量</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{variant.requests.toLocaleString()} 请求</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">成功率</div>
                          <div className="font-medium">{variant.successRate.toFixed(1)}%</div>
                          <Progress value={variant.successRate} className="mt-1" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">响应时间</div>
                          <div className="font-medium">{variant.avgResponseTime}ms</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">成本</div>
                          <div className="font-medium">¥{variant.cost.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">每请求成本</div>
                          <div className="font-medium">
                            ¥{variant.requests > 0 ? (variant.cost / variant.requests).toFixed(4) : "0.0000"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {test.status === "running" && test.startDate && (
                  <div className="text-sm text-muted-foreground">
                    测试开始时间: {new Date(test.startDate).toLocaleString("zh-CN")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">暂无A/B测试</p>
            <Button onClick={() => setShowCreateForm(true)}>创建第一个测试</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

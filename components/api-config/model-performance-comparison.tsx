"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { PaddleFlowClient } from "@/lib/api-binding/providers/paddleflow/paddleflow-client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Loader2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// 模型定义
const MODELS = [
  { id: "deepseek-r1", name: "DeepSeek-R1", provider: "飞桨星河" },
  { id: "llama-3-8b", name: "Llama-3-8B", provider: "飞桨星河" },
  { id: "qwen-max", name: "Qwen-Max", provider: "飞桨星河" },
  { id: "qwen-plus", name: "Qwen-Plus", provider: "飞桨星河" },
  { id: "ernie-bot-4", name: "ERNIE-Bot-4", provider: "飞桨星河" },
]

// 测试用例
const TEST_CASES = [
  {
    id: "reasoning",
    name: "推理能力",
    prompt:
      "如果一个苹果重150克，一个香蕉重120克，一个橙子重180克，那么5个苹果、3个香蕉和2个橙子一共重多少克？请详细解释计算过程。",
  },
  {
    id: "creativity",
    name: "创意写作",
    prompt: "请以'未来的城市'为主题，写一篇300字左右的短文，描述你想象中100年后的城市生活。",
  },
  {
    id: "knowledge",
    name: "知识问答",
    prompt: "请解释量子计算的基本原理，以及它与传统计算的主要区别。",
  },
  {
    id: "coding",
    name: "代码生成",
    prompt: "请用Python编写一个函数，实现快速排序算法，并解释代码的关键部分。",
  },
]

// 性能指标
interface PerformanceMetrics {
  modelId: string
  modelName: string
  responseTime: number
  tokenCount: number
  quality: number | null
  testCaseId: string
}

// 模型响应
interface ModelResponse {
  modelId: string
  modelName: string
  testCaseId: string
  testCaseName: string
  prompt: string
  response: string
  responseTime: number
  tokenCount: number
}

export default function ModelPerformanceComparison() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("https://aistudio.baidu.com/llm/lmapi/v3")
  const [selectedModels, setSelectedModels] = useState<string[]>(["deepseek-r1", "llama-3-8b"])
  const [selectedTestCase, setSelectedTestCase] = useState<string>("reasoning")
  const [isLoading, setIsLoading] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [responses, setResponses] = useState<ModelResponse[]>([])
  const [activeTab, setActiveTab] = useState<string>("chart")

  // 从环境变量获取API密钥
  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        setApiKey(process.env.NEXT_PUBLIC_API_KEY || "")
        setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || "https://aistudio.baidu.com/llm/lmapi/v3")
      } catch (error) {
        console.error("获取环境变量失败:", error)
      }
    }

    fetchEnvVars()
  }, [])

  // 运行性能测试
  const runPerformanceTest = async () => {
    if (!apiKey) {
      toast({
        title: "API密钥缺失",
        description: "请提供有效的API密钥",
        variant: "destructive",
      })
      return
    }

    if (selectedModels.length === 0) {
      toast({
        title: "未选择模型",
        description: "请至少选择一个模型进行测试",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setMetrics([])
    setResponses([])

    const testCase = TEST_CASES.find((tc) => tc.id === selectedTestCase)
    if (!testCase) {
      toast({
        title: "测试用例无效",
        description: "无法找到选定的测试用例",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const newMetrics: PerformanceMetrics[] = []
    const newResponses: ModelResponse[] = []

    try {
      // 并行测试所有选定的模型
      await Promise.all(
        selectedModels.map(async (modelId) => {
          const model = MODELS.find((m) => m.id === modelId)
          if (!model) return

          const client = new PaddleFlowClient({
            apiKey,
            baseUrl,
            model: modelId,
          })

          const startTime = Date.now()

          try {
            const response = await client.chat({
              messages: [{ role: "user", content: testCase.prompt }],
            })

            const endTime = Date.now()
            const responseTime = endTime - startTime

            // 估算token数量（简单估算，实际应从API响应获取）
            const tokenCount = Math.round((testCase.prompt.length + response.length) / 4)

            // 记录指标
            newMetrics.push({
              modelId,
              modelName: model.name,
              responseTime,
              tokenCount,
              quality: null, // 质量评分需要人工或另一个模型评估
              testCaseId: testCase.id,
            })

            // 记录响应
            newResponses.push({
              modelId,
              modelName: model.name,
              testCaseId: testCase.id,
              testCaseName: testCase.name,
              prompt: testCase.prompt,
              response,
              responseTime,
              tokenCount,
            })
          } catch (error: any) {
            console.error(`模型 ${model.name} 测试失败:`, error)
            toast({
              title: `模型 ${model.name} 测试失败`,
              description: error.message,
              variant: "destructive",
            })
          }
        }),
      )

      // 更新状态
      setMetrics(newMetrics)
      setResponses(newResponses)

      toast({
        title: "性能测试完成",
        description: `已完成 ${newResponses.length} 个模型的测试`,
      })
    } catch (error: any) {
      console.error("性能测试失败:", error)
      toast({
        title: "性能测试失败",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 切换模型选择
  const toggleModelSelection = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  // 准备图表数据
  const chartData = metrics.map((metric) => ({
    name: metric.modelName,
    响应时间: metric.responseTime,
    令牌数量: metric.tokenCount,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>模型性能对比</CardTitle>
        <CardDescription>比较不同飞桨星河模型在各种任务上的性能表现</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 模型选择 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">选择模型</h3>
          <div className="flex flex-wrap gap-2">
            {MODELS.map((model) => (
              <Badge
                key={model.id}
                variant={selectedModels.includes(model.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleModelSelection(model.id)}
              >
                {model.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* 测试用例选择 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">选择测试用例</h3>
          <div className="flex flex-wrap gap-2">
            {TEST_CASES.map((testCase) => (
              <Badge
                key={testCase.id}
                variant={selectedTestCase === testCase.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTestCase(testCase.id)}
              >
                {testCase.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* 运行测试按钮 */}
        <Button onClick={runPerformanceTest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 正在测试...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> 运行性能测试
            </>
          )}
        </Button>

        {/* 结果展示 */}
        {metrics.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart">性能图表</TabsTrigger>
              <TabsTrigger value="table">详细数据</TabsTrigger>
              <TabsTrigger value="responses">模型响应</TabsTrigger>
            </TabsList>

            {/* 图表视图 */}
            <TabsContent value="chart" className="pt-4">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="响应时间" fill="#8884d8" name="响应时间 (ms)" />
                    <Bar yAxisId="right" dataKey="令牌数量" fill="#82ca9d" name="令牌数量" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* 表格视图 */}
            <TabsContent value="table" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>模型</TableHead>
                    <TableHead>响应时间 (ms)</TableHead>
                    <TableHead>令牌数量</TableHead>
                    <TableHead>测试用例</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{metric.modelName}</TableCell>
                      <TableCell>{metric.responseTime}</TableCell>
                      <TableCell>{metric.tokenCount}</TableCell>
                      <TableCell>
                        {TEST_CASES.find((tc) => tc.id === metric.testCaseId)?.name || metric.testCaseId}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* 响应视图 */}
            <TabsContent value="responses" className="pt-4">
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{response.modelName}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{response.responseTime}ms</Badge>
                          <Badge variant="outline">{response.tokenCount} tokens</Badge>
                        </div>
                      </div>
                      <CardDescription>{response.testCaseName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">提示:</h4>
                          <p className="text-sm">{response.prompt}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">响应:</h4>
                          <ScrollArea className="h-40 rounded-md border p-2">
                            <p className="text-sm whitespace-pre-wrap">{response.response}</p>
                          </ScrollArea>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>已选择 {selectedModels.length} 个模型</div>
        <div>测试用例: {TEST_CASES.find((tc) => tc.id === selectedTestCase)?.name || selectedTestCase}</div>
      </CardFooter>
    </Card>
  )
}

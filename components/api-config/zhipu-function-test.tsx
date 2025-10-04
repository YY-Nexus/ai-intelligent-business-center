"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Play, CheckCircle, XCircle } from "lucide-react"
import ZhipuAIClient, { type ZhipuAIFunction } from "@/lib/api-binding/providers/zhipu/zhipu-client"
import { zhipuModels } from "@/lib/api-binding/providers/zhipu/zhipu-types"

const EXAMPLE_FUNCTIONS: ZhipuAIFunction[] = [
  {
    name: "get_weather",
    description: "获取指定城市的天气信息",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "城市名称",
        },
        date: {
          type: "string",
          description: "日期，可选，默认为今天",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "book_hotel",
    description: "预订酒店",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "城市名称",
        },
        checkin_date: {
          type: "string",
          description: "入住日期",
        },
        checkout_date: {
          type: "string",
          description: "退房日期",
        },
        guests: {
          type: "integer",
          description: "客人数量",
        },
        rooms: {
          type: "integer",
          description: "房间数量",
        },
        hotel_type: {
          type: "string",
          enum: ["经济型", "舒适型", "豪华型"],
          description: "酒店类型",
        },
      },
      required: ["city", "checkin_date", "checkout_date", "guests", "rooms"],
    },
  },
  {
    name: "search_products",
    description: "搜索产品信息",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "搜索关键词",
        },
        category: {
          type: "string",
          description: "产品类别",
        },
        price_min: {
          type: "number",
          description: "最低价格",
        },
        price_max: {
          type: "number",
          description: "最高价格",
        },
        sort_by: {
          type: "string",
          enum: ["price_asc", "price_desc", "popularity", "newest"],
          description: "排序方式",
        },
      },
      required: ["keyword"],
    },
  },
]

export function ZhipuFunctionTest() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("glm-4")
  const [prompt, setPrompt] = useState("我想知道北京今天的天气")
  const [functionJson, setFunctionJson] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [selectedExample, setSelectedExample] = useState("get_weather")
  const [activeTab, setActiveTab] = useState("function")

  // 从localStorage加载配置
  useEffect(() => {
    const storedApiKey = localStorage.getItem("zhipu_api_key")

    if (storedApiKey) setApiKey(storedApiKey)

    // 初始化函数JSON
    setFunctionJson(JSON.stringify(EXAMPLE_FUNCTIONS[0], null, 2))
  }, [])

  // 更新示例
  useEffect(() => {
    const example = EXAMPLE_FUNCTIONS.find((func) => func.name === selectedExample)
    if (example) {
      setFunctionJson(JSON.stringify(example, null, 2))
    }
  }, [selectedExample])

  // 执行函数调用测试
  const testFunctionCall = async () => {
    if (!apiKey) {
      toast({
        title: "无法执行测试",
        description: "请先配置API密钥",
        variant: "destructive",
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "无法执行测试",
        description: "请输入提示词",
        variant: "destructive",
      })
      return
    }

    try {
      // 解析函数定义
      const functions: ZhipuAIFunction[] = JSON.parse(functionJson)

      setIsLoading(true)
      setResponse(null)

      const client = new ZhipuAIClient({ apiKey })

      const result = await client.createChatCompletion({
        model,
        messages: [{ role: "user", content: prompt }],
        functions: functions,
        function_call: "auto",
      })

      setResponse(result)

      toast({
        title: "测试成功",
        description: "函数调用测试已完成",
      })
    } catch (error) {
      console.error("执行函数调用测试失败:", error)
      toast({
        title: "测试失败",
        description: error instanceof Error ? error.message : "执行测试时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>智谱AI函数调用测试</CardTitle>
        <CardDescription>测试智谱AI的函数调用功能 (Function Call)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model">模型</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              {zhipuModels
                .filter((m) => m.capabilities.includes("Function Call"))
                .map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">只显示支持函数调用的模型</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">提示词</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入提示词..."
            className="min-h-20"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="function">函数定义</TabsTrigger>
            <TabsTrigger value="examples">示例函数</TabsTrigger>
          </TabsList>
          <TabsContent value="function" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function-json">函数JSON定义</Label>
              <Textarea
                id="function-json"
                value={functionJson}
                onChange={(e) => setFunctionJson(e.target.value)}
                placeholder="输入函数JSON定义..."
                className="font-mono min-h-60"
              />
              <p className="text-xs text-muted-foreground">根据OpenAI的Function Call格式定义函数</p>
            </div>
          </TabsContent>
          <TabsContent value="examples" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="example-select">选择示例函数</Label>
              <Select value={selectedExample} onValueChange={setSelectedExample}>
                <SelectTrigger id="example-select">
                  <SelectValue placeholder="选择示例函数" />
                </SelectTrigger>
                <SelectContent>
                  {EXAMPLE_FUNCTIONS.map((func) => (
                    <SelectItem key={func.name} value={func.name}>
                      {func.name} - {func.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={testFunctionCall} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              测试中...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              执行函数调用测试
            </>
          )}
        </Button>

        {response && (
          <div className="space-y-2">
            <Label>响应结果</Label>
            <div className="rounded-md border p-4 bg-muted">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">状态</div>
                  <div className="flex items-center">
                    {response.choices[0].finish_reason === "function_call" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">成功调用函数</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-500">未调用函数</span>
                      </>
                    )}
                  </div>
                </div>

                {response.choices[0].message.function_call ? (
                  <>
                    <div className="font-medium mt-2">函数调用</div>
                    <div className="bg-black/90 text-white p-3 rounded-md font-mono text-sm overflow-auto">
                      <div>函数名称: {response.choices[0].message.function_call.name}</div>
                      <div className="mt-2">参数:</div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(response.choices[0].message.function_call.arguments), null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium mt-2">模型响应</div>
                    <div className="bg-black/90 text-white p-3 rounded-md font-mono text-sm overflow-auto">
                      {response.choices[0].message.content}
                    </div>
                  </>
                )}

                <div className="font-medium mt-2">Token使用情况</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>输入: {response.usage.prompt_tokens}</div>
                  <div>输出: {response.usage.completion_tokens}</div>
                  <div>总计: {response.usage.total_tokens}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

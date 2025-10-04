"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// 预定义的函数示例
const FUNCTION_EXAMPLES = [
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
]

// 预定义的提示词示例
const PROMPT_EXAMPLES = [
  "北京今天的天气怎么样？",
  "我想找一些价格在100到500元之间的手机配件",
  "帮我在上海预订一个豪华型酒店，5月20日入住，5月22日退房，2个人1间房",
]

export default function FunctionCallingPage() {
  const [prompt, setPrompt] = useState(PROMPT_EXAMPLES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("result")
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null)
  const [functionResponse, setFunctionResponse] = useState<any>(null)

  // 调用函数
  const handleFunctionCall = async () => {
    if (!result?.function_call) {
      setError("没有可执行的函数调用")
      return
    }

    try {
      setSelectedFunction(result.function_call.name)

      // 模拟函数执行结果
      let mockResponse

      switch (result.function_call.name) {
        case "get_weather":
          const weatherParams = JSON.parse(result.function_call.arguments)
          mockResponse = {
            city: weatherParams.city,
            date: weatherParams.date || "今天",
            temperature: Math.floor(Math.random() * 15) + 15,
            condition: ["晴朗", "多云", "小雨", "阴天"][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 30) + 40,
            wind: Math.floor(Math.random() * 5) + 1 + "级",
          }
          break

        case "search_products":
          const searchParams = JSON.parse(result.function_call.arguments)
          mockResponse = {
            keyword: searchParams.keyword,
            category: searchParams.category || "全部",
            results: [
              {
                id: "p1",
                name: `${searchParams.keyword} 高级版`,
                price: searchParams.price_min ? Math.max(searchParams.price_min, 199) : 199,
                rating: 4.5,
                reviews: 120,
              },
              {
                id: "p2",
                name: `${searchParams.keyword} 标准版`,
                price: searchParams.price_min ? Math.max(searchParams.price_min, 149) : 149,
                rating: 4.2,
                reviews: 85,
              },
              {
                id: "p3",
                name: `${searchParams.keyword} 入门版`,
                price: searchParams.price_min ? Math.max(searchParams.price_min, 99) : 99,
                rating: 3.8,
                reviews: 42,
              },
            ],
            total: 3,
          }
          break

        case "book_hotel":
          const bookingParams = JSON.parse(result.function_call.arguments)
          mockResponse = {
            booking_id: "BK" + Math.floor(Math.random() * 10000),
            hotel_name: `${bookingParams.hotel_type || "舒适型"}酒店 - ${bookingParams.city}中心店`,
            checkin_date: bookingParams.checkin_date,
            checkout_date: bookingParams.checkout_date,
            guests: bookingParams.guests,
            rooms: bookingParams.rooms,
            total_price:
              bookingParams.rooms *
              (bookingParams.hotel_type === "豪华型" ? 888 : bookingParams.hotel_type === "舒适型" ? 588 : 388),
            status: "已确认",
          }
          break

        default:
          mockResponse = { error: "未知函数" }
      }

      setFunctionResponse(mockResponse)

      // 调用API继续对话
      await continueConversation(mockResponse)
    } catch (err) {
      console.error("函数执行错误:", err)
      setError(err instanceof Error ? err.message : "函数执行失败")
    }
  }

  // 继续对话
  const continueConversation = async (functionResult: any) => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/zhipu/function-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          function_name: result.function_call.name,
          function_response: functionResult,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)
      setActiveTab("result")
    } catch (err) {
      console.error("继续对话错误:", err)
      setError(err instanceof Error ? err.message : "继续对话失败")
    } finally {
      setLoading(false)
    }
  }

  // 调用API
  const callAPI = async () => {
    try {
      setLoading(true)
      setError("")
      setResult(null)
      setFunctionResponse(null)
      setSelectedFunction(null)

      const response = await fetch("/api/zhipu/function-calling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          functions: FUNCTION_EXAMPLES,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      console.error("API调用错误:", err)
      setError(err instanceof Error ? err.message : "API调用失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">智谱AI函数调用示例</h1>
      <p className="text-muted-foreground">
        本示例展示了如何使用智谱AI的函数调用(Function Calling)功能，让AI识别用户意图并调用相应的函数。
      </p>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          函数调用允许AI模型识别何时应该调用预定义的函数，并以结构化格式提供参数。这对于构建智能助手和自动化工作流非常有用。
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>输入提示词</CardTitle>
              <CardDescription>输入您想要发送给智谱AI的提示词</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="输入提示词..."
                className="min-h-[100px]"
              />
              <div className="flex flex-wrap gap-2">
                {PROMPT_EXAMPLES.map((example, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setPrompt(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={callAPI} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "处理中..." : "发送请求"}
              </Button>
            </CardFooter>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="result">AI响应</TabsTrigger>
              <TabsTrigger value="function" disabled={!result?.function_call}>
                函数调用
              </TabsTrigger>
              <TabsTrigger value="function-result" disabled={!functionResponse}>
                函数结果
              </TabsTrigger>
            </TabsList>

            <TabsContent value="result" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI响应</CardTitle>
                  <CardDescription>AI对您提示词的响应</CardDescription>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : result ? (
                    <div className="space-y-4">
                      {result.content && (
                        <div className="whitespace-pre-wrap bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto">
                          {result.content}
                        </div>
                      )}

                      {result.function_call && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50">
                              函数调用
                            </Badge>
                            <span className="font-medium">{result.function_call.name}</span>
                          </div>
                          <div className="bg-muted p-4 rounded-md">
                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(JSON.parse(result.function_call.arguments), null, 2)}
                            </pre>
                          </div>
                          <Button
                            size="sm"
                            onClick={handleFunctionCall}
                            disabled={loading || selectedFunction !== null}
                          >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            执行函数
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">AI响应将显示在这里...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="function" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>函数调用详情</CardTitle>
                  <CardDescription>AI识别的函数和参数</CardDescription>
                </CardHeader>
                <CardContent>
                  {result?.function_call ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">函数名称</h3>
                        <div className="bg-muted p-2 rounded-md">{result.function_call.name}</div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-1">函数参数</h3>
                        <div className="bg-muted p-4 rounded-md">
                          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(result.function_call.arguments), null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-1">函数定义</h3>
                        <div className="bg-muted p-4 rounded-md">
                          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(
                              FUNCTION_EXAMPLES.find((f) => f.name === result.function_call.name),
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">没有函数调用信息</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="function-result" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>函数执行结果</CardTitle>
                  <CardDescription>函数返回的数据</CardDescription>
                </CardHeader>
                <CardContent>
                  {functionResponse ? (
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(functionResponse, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">函数尚未执行</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>可用函数</CardTitle>
              <CardDescription>AI可以调用的预定义函数</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {FUNCTION_EXAMPLES.map((func, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={selectedFunction === func.name ? "bg-green-50" : ""}>
                          {func.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{func.description}</p>
                      <div className="bg-muted p-3 rounded-md">
                        <h4 className="text-xs font-medium mb-1">参数:</h4>
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(func.parameters.properties, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

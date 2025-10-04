"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { PaddleFlowClient } from "@/lib/api-binding/providers/paddleflow/paddleflow-client"
import { Loader2, Send, Trash } from "lucide-react"

interface Message {
  role: "system" | "user" | "assistant"
  content: string
  timestamp: number
}

export default function PaddleFlowDemo() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("https://aistudio.baidu.com/llm/lmapi/v3")
  const [model, setModel] = useState("deepseek-r1")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "你是一个有用的AI助手。",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [useStream, setUseStream] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 从环境变量获取API密钥
  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        setApiKey(process.env.NEXT_PUBLIC_API_KEY || "")
        setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || "https://aistudio.baidu.com/llm/lmapi/v3")
        setModel(process.env.NEXT_PUBLIC_MODEL || "deepseek-r1")
      } catch (error) {
        console.error("获取环境变量失败:", error)
      }
    }

    fetchEnvVars()
  }, [])

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    if (!apiKey) {
      toast({
        title: "API密钥缺失",
        description: "请提供有效的API密钥",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const client = new PaddleFlowClient({
        apiKey,
        baseUrl,
        model,
        temperature,
        maxTokens,
      })

      const chatMessages = messages.concat(userMessage).map(({ role, content }) => ({
        role,
        content,
      }))

      if (useStream) {
        // 创建一个占位的助手消息
        const assistantMessage: Message = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        await client.chatStream(
          { messages: chatMessages },
          {
            onStart: () => {
              console.log("开始流式响应")
            },
            onToken: (token) => {
              setMessages((prev) => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage.role === "assistant") {
                  lastMessage.content += token
                }
                return newMessages
              })
            },
            onComplete: (fullText) => {
              console.log("流式响应完成")
              setIsLoading(false)
            },
            onError: (error) => {
              console.error("流式响应错误:", error)
              toast({
                title: "请求失败",
                description: error.message,
                variant: "destructive",
              })
              setIsLoading(false)
            },
          },
        )
      } else {
        const response = await client.chat({ messages: chatMessages })

        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("请求失败:", error)
      toast({
        title: "请求失败",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // 清除对话
  const clearConversation = () => {
    setMessages([
      {
        role: "system",
        content: "你是一个有用的AI助手。",
        timestamp: Date.now(),
      },
    ])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>飞桨星河API演示</CardTitle>
        <CardDescription>使用飞桨星河社区提供的OpenAI兼容API服务进行对话</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* API配置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-r1">DeepSeek-R1</SelectItem>
                <SelectItem value="llama-3-8b">Llama-3-8B</SelectItem>
                <SelectItem value="qwen-max">Qwen-Max</SelectItem>
                <SelectItem value="qwen-plus">Qwen-Plus</SelectItem>
                <SelectItem value="ernie-bot-4">ERNIE-Bot-4</SelectItem>
                <SelectItem value="ernie-bot-8k">ERNIE-Bot-8K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">温度: {temperature.toFixed(1)}</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(values) => setTemperature(values[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-tokens">最大令牌数: {maxTokens}</Label>
            <Slider
              id="max-tokens"
              min={256}
              max={4096}
              step={256}
              value={[maxTokens]}
              onValueChange={(values) => setMaxTokens(values[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="stream-toggle">流式响应</Label>
              <Switch id="stream-toggle" checked={useStream} onCheckedChange={setUseStream} />
            </div>
          </div>
        </div>

        {/* 对话区域 */}
        <div className="border rounded-md p-4 h-[400px] overflow-y-auto bg-muted/20">
          {messages.map(
            (message, index) =>
              message.role !== "system" && (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12"
                  }`}
                >
                  <div className="font-semibold mb-1">{message.role === "user" ? "用户" : "助手"}</div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ),
          )}
          {isLoading && !useStream && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的消息..."
            className="flex-1 min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()} className="h-10">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={clearConversation} className="h-10" title="清除对话">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>模型: {model}</div>
        <div>消息数: {messages.filter((m) => m.role !== "system").length}</div>
      </CardFooter>
    </Card>
  )
}

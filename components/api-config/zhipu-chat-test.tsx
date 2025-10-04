"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Trash, Settings, MessageSquare } from "lucide-react"
import ZhipuAIClient, { type ZhipuAIMessage } from "@/lib/api-binding/providers/zhipu/zhipu-client"
import { zhipuModels } from "@/lib/api-binding/providers/zhipu/zhipu-types"

export function ZhipuChatTest() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("glm-3-turbo")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [systemPrompt, setSystemPrompt] = useState("你是智谱AI开发的大语言模型，请用中文回答我的问题。")
  const [messages, setMessages] = useState<ZhipuAIMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [streamData, setStreamData] = useState("")

  // 从localStorage加载配置
  useEffect(() => {
    const storedApiKey = localStorage.getItem("zhipu_api_key")
    const storedDefaultModel = localStorage.getItem("zhipu_default_model")

    if (storedApiKey) setApiKey(storedApiKey)
    if (storedDefaultModel) setModel(storedDefaultModel)
  }, [])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamData])

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim()) return
    if (!apiKey) {
      toast({
        title: "无法发送消息",
        description: "请先配置API密钥",
        variant: "destructive",
      })
      return
    }

    const userMessage: ZhipuAIMessage = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStreamData("")

    try {
      const client = new ZhipuAIClient({ apiKey })

      // 准备请求消息
      const requestMessages: ZhipuAIMessage[] = []

      // 如果有系统提示且模型支持，则添加系统消息
      if (systemPrompt.trim() && model !== "chatglm_std" && model !== "chatglm_lite") {
        requestMessages.push({ role: "system", content: systemPrompt.trim() })
      }

      // 添加历史消息
      requestMessages.push(...messages, userMessage)

      // 使用流式响应
      const stream = await client.createChatCompletionStream({
        model,
        messages: requestMessages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        // 解码响应流
        const chunk = decoder.decode(value)
        // 处理每行数据
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.choices && parsed.choices[0]?.delta?.content) {
                fullContent += parsed.choices[0].delta.content
                setStreamData(fullContent)
              }
            } catch (e) {
              console.error("解析响应流数据失败:", e)
            }
          }
        }
      }

      // 添加完整的助手响应
      const assistantMessage: ZhipuAIMessage = {
        role: "assistant",
        content: fullContent,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setStreamData("")
    } catch (error) {
      console.error("发送消息到智谱AI失败:", error)
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "发送消息时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 清空聊天历史
  const clearMessages = () => {
    setMessages([])
    setStreamData("")
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>智谱AI聊天测试</CardTitle>
            <CardDescription>使用智谱AI模型进行对话测试</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Settings className="h-4 w-4 mr-1" />
              {showAdvanced ? "隐藏设置" : "显示设置"}
            </Button>
            <Button variant="outline" size="sm" onClick={clearMessages} disabled={messages.length === 0 && !streamData}>
              <Trash className="h-4 w-4 mr-1" />
              清空对话
            </Button>
          </div>
        </div>
      </CardHeader>

      {showAdvanced && (
        <div className="px-6 py-2 border-b space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">模型</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {zhipuModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>温度: {temperature}</Label>
              <Slider
                value={[temperature]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => setTemperature(value[0])}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-prompt">系统提示词</Label>
            <Textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="输入系统提示词..."
              className="resize-none h-20"
            />
          </div>
        </div>
      )}

      <CardContent className="flex-grow overflow-hidden pt-4 px-4">
        <ScrollArea className="h-full pr-4">
          {messages.length === 0 && !streamData ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
              <p>开始与智谱AI聊天</p>
              <p className="text-sm">输入消息并点击发送按钮开始对话</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline">{message.role}</Badge>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {streamData && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline">assistant</Badge>
                    </div>
                    <div className="whitespace-pre-wrap">{streamData}</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex space-x-2 w-full">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (!isLoading) sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
            发送
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

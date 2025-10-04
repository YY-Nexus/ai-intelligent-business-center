"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Settings, Zap } from "lucide-react"
import { useProviders } from "@/hooks/use-providers"
import { useUnifiedApi } from "@/hooks/use-unified-api"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  provider?: string
  model?: string
}

export default function ChatPage() {
  const { toast } = useToast()
  const { providers } = useProviders()
  const { sendChatMessage, isLoading } = useUnifiedApi()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "欢迎使用统一AI API管理系统的聊天测试界面。您可以在这里测试不同AI提供商的响应。",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [showSettings, setShowSettings] = useState(false)
  const [useSmartRouting, setUseSmartRouting] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 初始化选择第一个可用的提供商
  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      const activeProviders = providers.filter((p) => p.status === "active")
      if (activeProviders.length > 0) {
        setSelectedProvider(activeProviders[0].id)
        setSelectedModel(activeProviders[0].defaultModel)
      }
    }
  }, [providers, selectedProvider])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const response = await sendChatMessage({
        messages: messages
          .filter((m) => m.role !== "system")
          .concat(userMessage)
          .map((m) => ({ role: m.role, content: m.content })),
        providerId: useSmartRouting ? undefined : selectedProvider,
        model: useSmartRouting ? undefined : selectedModel,
        temperature,
        maxTokens,
      })

      const assistantMessage: Message = {
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
        provider: response.provider,
        model: response.model,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (response.provider !== selectedProvider && !useSmartRouting) {
        toast({
          title: "提供商自动切换",
          description: `由于原提供商不可用，系统自动切换到了${
            providers.find((p) => p.id === response.provider)?.name || response.provider
          }`,
        })
      }
    } catch (error) {
      console.error("发送消息失败:", error)
      toast({
        title: "发送失败",
        description: "无法发送消息，请检查提供商配置或网络连接",
        variant: "destructive",
      })

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "消息发送失败，请检查提供商配置或网络连接。",
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getProviderModels = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    return provider?.models || []
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI聊天测试</h1>
            <p className="text-muted-foreground">测试不同AI提供商的聊天功能和响应质量</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? "bg-muted" : ""}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showSettings ? "隐藏设置" : "显示设置"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-${showSettings ? "2" : "3"}`}>
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>聊天测试</CardTitle>
                  <div className="flex items-center gap-2">
                    {useSmartRouting ? (
                      <Badge variant="default" className="bg-green-600">
                        <Zap className="h-3 w-3 mr-1" />
                        智能路由
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {providers.find((p) => p.id === selectedProvider)?.name || "未选择提供商"}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>与AI进行对话，测试响应质量和性能</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[calc(100vh-16rem)]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : message.role === "system"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {message.provider && (
                              <div className="mt-2 text-xs opacity-70">
                                提供商: {providers.find((p) => p.id === message.provider)?.name || message.provider}
                                {message.model && ` | 模型: ${message.model}`}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入消息..."
                        className="min-h-[60px] resize-none"
                        disabled={isLoading}
                      />
                      <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="self-end">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {showSettings && (
            <div className="lg:col-span-1">
              <Card className="h-[calc(100vh-12rem)]">
                <CardHeader>
                  <CardTitle>聊天设置</CardTitle>
                  <CardDescription>配置AI提供商和模型参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smart-routing">使用智能路由</Label>
                      <Switch id="smart-routing" checked={useSmartRouting} onCheckedChange={setUseSmartRouting} />
                    </div>
                    <p className="text-sm text-muted-foreground">启用后，系统将根据路由规则自动选择最佳提供商</p>
                  </div>

                  {!useSmartRouting && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="provider">AI提供商</Label>
                        <Select
                          value={selectedProvider || ""}
                          onValueChange={setSelectedProvider}
                          disabled={useSmartRouting}
                        >
                          <SelectTrigger id="provider">
                            <SelectValue placeholder="选择AI提供商" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers
                              .filter((p) => p.status === "active")
                              .map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model">AI模型</Label>
                        <Select
                          value={selectedModel || ""}
                          onValueChange={setSelectedModel}
                          disabled={!selectedProvider || useSmartRouting}
                        >
                          <SelectTrigger id="model">
                            <SelectValue placeholder="选择AI模型" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProvider &&
                              getProviderModels(selectedProvider).map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature">温度: {temperature}</Label>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>精确</span>
                      <span>创造性</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="max-tokens">最大令牌数: {maxTokens}</Label>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={100}
                      max={4000}
                      step={100}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                    />
                  </div>

                  <Tabs defaultValue="info">
                    <TabsList className="w-full">
                      <TabsTrigger value="info" className="flex-1">
                        提供商信息
                      </TabsTrigger>
                      <TabsTrigger value="capabilities" className="flex-1">
                        能力对比
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="mt-4">
                      <div className="space-y-4">
                        {selectedProvider && !useSmartRouting ? (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              {providers.find((p) => p.id === selectedProvider)?.name}
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>API类型: {providers.find((p) => p.id === selectedProvider)?.apiType}</p>
                              <p>
                                健康状态:{" "}
                                {
                                  {
                                    healthy: "正常",
                                    degraded: "性能下降",
                                    unhealthy: "不可用",
                                  }[providers.find((p) => p.id === selectedProvider)?.healthStatus || ""]
                                }
                              </p>
                              <p>描述: {providers.find((p) => p.id === selectedProvider)?.description}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {useSmartRouting ? (
                              <p>已启用智能路由。系统将根据路由规则自动选择最佳提供商。</p>
                            ) : (
                              <p>请选择一个AI提供商以查看详细信息。</p>
                            )}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="capabilities" className="mt-4">
                      <div className="text-sm">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="text-left font-medium py-2">能力</th>
                              <th className="text-center font-medium py-2">支持</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedProvider && !useSmartRouting ? (
                              <>
                                <tr>
                                  <td className="py-2">文本生成</td>
                                  <td className="text-center py-2">✓</td>
                                </tr>
                                <tr>
                                  <td className="py-2">多轮对话</td>
                                  <td className="text-center py-2">✓</td>
                                </tr>
                                <tr>
                                  <td className="py-2">流式响应</td>
                                  <td className="text-center py-2">
                                    {providers
                                      .find((p) => p.id === selectedProvider)
                                      ?.capabilities?.includes("streaming")
                                      ? "✓"
                                      : "✗"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2">函数调用</td>
                                  <td className="text-center py-2">
                                    {providers
                                      .find((p) => p.id === selectedProvider)
                                      ?.capabilities?.includes("function_calling")
                                      ? "✓"
                                      : "✗"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2">图像理解</td>
                                  <td className="text-center py-2">
                                    {providers.find((p) => p.id === selectedProvider)?.capabilities?.includes("vision")
                                      ? "✓"
                                      : "✗"}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td colSpan={2} className="py-4 text-center text-muted-foreground">
                                  {useSmartRouting ? (
                                    <p>已启用智能路由。系统将根据路由规则自动选择最佳提供商。</p>
                                  ) : (
                                    <p>请选择一个AI提供商以查看能力对比。</p>
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

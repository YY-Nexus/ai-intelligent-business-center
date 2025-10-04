"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react"

// 定义支持的模型类型
type ModelProvider = "openai" | "anthropic" | "google" | "groq"

export function AIChat() {
  // 当前选择的模型提供商
  const [provider, setProvider] = useState<ModelProvider>("openai")

  // 使用 AI SDK 的 useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      provider,
    },
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
            AI 聊天助手
          </CardTitle>

          <Select value={provider} onValueChange={(value) => setProvider(value as ModelProvider)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择模型提供商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="google">Google AI</SelectItem>
              <SelectItem value="groq">Groq</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">聊天</TabsTrigger>
            <TabsTrigger value="info">关于 AI SDK</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="max-w-md space-y-2">
                    <Bot className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-semibold">开始与 AI 对话</h3>
                    <p className="text-sm text-gray-500">
                      使用 Vercel AI SDK 与不同的 AI 模型进行对话。您可以从右上角选择不同的模型提供商。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[80%] ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          <span className="text-xs font-medium">{message.role === "user" ? "您" : "AI 助手"}</span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">错误: {error.message}</div>}
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vercel AI SDK</h3>
              <p>
                Vercel AI SDK 是一个由 Vercel（Next.js 的创建者）开发的免费开源 TypeScript 工具包，专为构建 AI
                驱动的应用程序而设计。
              </p>

              <h4 className="text-md font-semibold">主要特点</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>统一的提供商 API：只需更改一行代码即可在不同 AI 提供商之间切换</li>
                <li>框架无关：支持 React、Next.js、Vue、Nuxt、SvelteKit 等多种框架</li>
                <li>流式 AI 响应：实时向用户发送 AI 响应，无需等待</li>
                <li>生成式 UI：创建动态的 AI 驱动用户界面</li>
              </ul>

              <h4 className="text-md font-semibold">支持的模型提供商</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>OpenAI (GPT-4o, GPT-4.5, o3-mini 等)</li>
                <li>Anthropic</li>
                <li>Google Generative AI</li>
                <li>xAI (Grok)</li>
                <li>Groq</li>
                <li>Fal AI</li>
                <li>DeepInfra</li>
                <li>等等</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input placeholder="输入您的问题..." value={input} onChange={handleInputChange} disabled={isLoading} />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

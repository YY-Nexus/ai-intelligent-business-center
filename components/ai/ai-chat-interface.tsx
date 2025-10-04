"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Loader2, Send, ImageIcon, Sparkles, Bot, User, RefreshCw } from "lucide-react"
import { GLM4VClient } from "@/lib/ai/glm4v-client"
import { useToast } from "@/components/ui/use-toast"
import type { ChatCompletionRequestMessage } from "@/lib/ai/types"
import ReactMarkdown from "react-markdown"

interface AiChatInterfaceProps {
  apiKey?: string
  modelName?: string
  systemPrompt?: string
}

export function AiChatInterface({ apiKey, modelName = "GLM-4V", systemPrompt }: AiChatInterfaceProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 初始化系统提示
  useEffect(() => {
    if (systemPrompt && messages.length === 0) {
      setMessages([
        {
          role: "system",
          content: systemPrompt,
        },
      ])
    }
  }, [systemPrompt, messages.length])

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() && !imageUrl) return

    if (!apiKey) {
      toast({
        title: "API密钥缺失",
        description: "请提供GLM-4V API密钥",
        variant: "destructive",
      })
      return
    }

    // 准备用户消息
    let userMessage: ChatCompletionRequestMessage

    if (imageUrl) {
      userMessage = {
        role: "user",
        content: [
          { type: "text", text: input || "请描述这张图片" },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      }
    } else {
      userMessage = {
        role: "user",
        content: input,
      }
    }

    // 更新消息列表
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setImageUrl(null)
    setIsLoading(true)

    try {
      // 创建GLM-4V客户端
      const client = new GLM4VClient({
        apiKey,
        model: "glm-4v",
      })

      // 准备完整的消息历史
      const fullMessages = [...messages, userMessage]

      // 添加临时的助手消息
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      let responseText = ""

      // 使用流式API
      await client.chatStream(fullMessages, {
        onStart: () => {
          // 开始流式响应
        },
        onToken: (token) => {
          responseText += token
          // 更新最后一条消息
          setMessages((prev) => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: responseText,
            }
            return newMessages
          })
        },
        onComplete: (fullText) => {
          // 流式响应完成
        },
        onError: (error) => {
          toast({
            title: "AI响应错误",
            description: error.message,
            variant: "destructive",
          })

          // 移除临时消息
          setMessages((prev) => prev.slice(0, -1))
        },
      })
    } catch (error: any) {
      toast({
        title: "发送消息失败",
        description: error.message,
        variant: "destructive",
      })

      // 移除临时消息
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)

    // 在实际应用中，这里应该上传图片到服务器或云存储
    // 这里仅作为示例，使用本地URL
    const reader = new FileReader()
    reader.onload = () => {
      setImageUrl(reader.result as string)
      setImageUploading(false)
    }
    reader.onerror = () => {
      toast({
        title: "图片上传失败",
        description: "无法读取所选图片",
        variant: "destructive",
      })
      setImageUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // 清空聊天
  const clearChat = () => {
    setMessages(systemPrompt ? [{ role: "system", content: systemPrompt }] : [])
  }

  return (
    <Card className="w-full h-[700px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              {modelName} 聊天
            </CardTitle>
            <CardDescription>与AI助手进行对话，支持图像理解</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4 mr-2" />
            清空聊天
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 pt-4 pb-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                <Bot className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium">开始与AI助手对话</p>
                <p className="text-sm max-w-md">您可以询问任何问题，上传图片请求分析，或者请求AI帮助您完成各种任务。</p>
              </div>
            ) : (
              messages.map((message, index) => {
                // 跳过系统消息
                if (message.role === "system") return null

                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {typeof message.content === "string" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {message.content.map((item, i) => {
                            if (item.type === "text") {
                              return <p key={i}>{item.text}</p>
                            } else if (item.type === "image_url") {
                              const url = typeof item.image_url === "string" ? item.image_url : item.image_url.url
                              return (
                                <div key={i} className="rounded-md overflow-hidden">
                                  <img
                                    src={url || "/placeholder.svg"}
                                    alt="用户上传的图片"
                                    className="max-h-[200px] object-contain"
                                  />
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 bg-primary">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </Avatar>
                    )}
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        {imageUrl && (
          <div className="mb-2 relative rounded-md overflow-hidden w-16 h-16">
            <img src={imageUrl || "/placeholder.svg"} alt="上传的图片" className="w-full h-full object-cover" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 h-5 w-5 rounded-full"
              onClick={() => setImageUrl(null)}
            >
              <span className="sr-only">移除图片</span>
              <span aria-hidden="true">×</span>
            </Button>
          </div>
        )}
        <div className="flex w-full items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || imageUploading}
          >
            {imageUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            <span className="sr-only">上传图片</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isLoading}
          />

          <Textarea
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            className="min-h-10 flex-1"
            disabled={isLoading}
          />

          <Button onClick={sendMessage} disabled={isLoading || (!input.trim() && !imageUrl)}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">发送</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useApiConfig } from "@/components/api-config/api-config-manager"
import { AiService } from "@/lib/ai/ai-service"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Copy, Download, Trash2, Settings, FileText, Shield, Code, Search, BarChart, MessageSquare, Sparkles, Loader2, ChevronDown, ChevronUp, Zap } from 'lucide-react'

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export default function ApiAiAssistant() {
  const { configs } = useApiConfig()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "我是您的API管理助手。我可以帮助您生成API文档、分析API安全性、生成客户端代码等。请告诉我您需要什么帮助？",
      timestamp: new Date()
    },
    {
      role: "assistant",
      content: "您好！我是您的API管理助手。我可以帮助您：\n\n- 生成API文档\n- 分析API安全性\n- 生成客户端代码\n- 处理自然语言查询\n- 分析API请求模式\n- 提供API管理建议\n\n请告诉我您需要什么帮助？",
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [streamResponse, setStreamResponse] = useState(true)
  const [temperature, setTemperature] = useState(0.7)
  const [showSettings, setShowSettings] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    // 添加用户消息
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setPrompt("")
    setIsLoading(true)

    try {
      let result = ""

      // 根据当前选项卡确定AI任务类型
      const taskType = activeTab === "chat" ? "general" : activeTab
      
      if (streamResponse) {
        // 添加一个空的助手消息，用于流式更新
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "",
          timestamp: new Date()
        }])
        
        // 流式响应处理
        const stream = await AiService.streamChat(
          prompt, 
          configs, 
          taskType, 
          selectedModel, 
          temperature,
          (chunk) => {
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === "assistant") {
                lastMessage.content += chunk
              }
              return newMessages
            })
          }
        )
        
        // 流式响应完成
        result = await stream.finalContent
      } else {
        // 非流式响应
        switch (taskType) {
          case "documentation":
            result = await AiService.generateApiDocumentation(prompt, configs, selectedModel, temperature)
            break
          case "security":
            result = await AiService.analyzeApiSecurity(prompt, configs, selectedModel, temperature)
            break
          case "code":
            result = await AiService.generateClientCode(prompt, configs, selectedModel, temperature)
            break
          case "query":
            result = await AiService.naturalLanguageQuery(prompt, configs, selectedModel, temperature)
            break
          case "analysis":
            result = await AiService.analyzeApiRequests(prompt, configs, selectedModel, temperature)
            break
          default:
            result = await AiService.chat(prompt, configs, selectedModel, temperature)
        }
        
        // 添加助手响应
        setMessages(prev => [...prev, {
          role: "assistant",
          content: result,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error("AI请求失败:", error)
      toast({
        title: "请求失败",
        description: "无法完成AI请求，请稍后再试。",
        variant: "destructive",
      })
      
      // 添加错误消息
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "抱歉，处理您的请求时出现了错误。请稍后再试。",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      // 自动聚焦回输入框
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter 提交
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  // 复制消息内容
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "已复制",
      description: "消息内容已复制到剪贴板。",
    })
  }
  
  // 下载聊天记录
  const downloadChat = () => {
    const chatContent = messages
      .filter(msg => msg.role !== "system")
      .map(msg => `${msg.role === "user" ? "用户" : "助手"} (${msg.timestamp.toLocaleString("zh-CN")}):\n${msg.content}\n\n`)
      .join("")
    
    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `api-assistant-chat-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "已下载",
      description: "聊天记录已下载。",
    })
  }
  
  // 清空聊天记录
  const clearChat = () => {
    setMessages([
      {
        role: "system",
        content: "我是您的API管理助手。我可以帮助您生成API文档、分析API安全性、生成客户端代码等。请告诉我您需要什么帮助？",
        timestamp: new Date()
      },
      {
        role: "assistant",
        content: "您好！我是您的API管理助手。我可以帮助您：\n\n- 生成API文档\n- 分析API安全性\n- 生成客户端代码\n- 处理自然语言查询\n- 分析API请求模式\n- 提供API管理建议\n\n请告诉我您需要什么帮助？",
        timestamp: new Date()
      }
    ])
    
    toast({
      title: "已清空",
      description: "聊天记录已清空。",
    })
  }
  
  // 获取占位符文本
  const getPlaceholderByTab = (tab: string): string => {
    switch (tab) {
      case "documentation":
        return "描述您的API，或指定要为哪个API配置生成文档..."
      case "security":
        return "描述您的安全关注点，或指定要分析的API配置..."
      case "code":
        return "描述您需要的客户端代码，指定编程语言和API配置..."
      case "query":
        return "用自然语言描述您想要获取的数据..."
      case "analysis":
        return "描述您想分析的API使用模式或性能问题..."
      default:
        return "有什么可以帮助您的？按 Ctrl+Enter 发送"
    }
  }
  
  // 获取示例提示
  const getExamplePrompts = (tab: string): string[] => {
    switch (tab) {
      case "documentation":
        return [
          "为我的用户API生成OpenAPI文档",
          "创建一个RESTful API的Markdown文档模板",
          "为我的支付API端点生成详细的参数说明"
        ]
      case "security":
        return [
          "分析我的API认证机制的安全性",
          "检查我的API是否存在常见的安全漏洞",
          "提供API安全最佳实践建议"
        ]
      case "code":
        return [
          "生成一个调用我的用户API的TypeScript客户端",
          "创建一个Python SDK来访问我的API",
          "为我的API生成一个带有错误处理的JavaScript客户端"
        ]
      case "query":
        return [
          "如何获取最近7天内的活跃用户？",
          "如何查询某个产品的库存状态？",
          "如何获取按销售额排序的前10个产品？"
        ]
      case "analysis":
        return [
          "分析我的API性能瓶颈",
          "帮我找出API响应时间过长的原因",
          "如何优化我的API缓存策略？"
        ]
      default:
        return [
          "帮我解释RESTful API设计原则",
          "如何设计一个高效的API认证系统？",
          "API版本控制的最佳实践是什么？"
        ]
    }
  }

  // 使用示例提示
  const useExamplePrompt = (example: string) => {
    setPrompt(example)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // 渲染消息
  const renderMessage = (message: ChatMessage, index: number) => {
    if (message.role === "system") return null

    const isUser = message.role === "user"
    const formattedTime = message.timestamp.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    })

    return (
      <div
        key={index}
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}
      >
        <div className="flex items-center mb-1">
          <Badge variant={isUser ? "outline" : "default"} className="text-xs">
            {isUser ? "用户" : "AI助手"}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">{formattedTime}</span>
        </div>
        <div
          className={`max-w-[85%] rounded-lg p-4 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {!isUser && (
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => copyMessage(message.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 渲染示例提示按钮
  const renderExamplePrompts = () => {
    const examples = getExamplePrompts(activeTab)
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => useExamplePrompt(example)}
            className="text-xs"
          >
            {example}
          </Button>
        ))}
      </div>
    )
  }

  // 获取当前标签页的图标
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "documentation":
        return <FileText className="h-4 w-4 mr-2" />
      case "security":
        return <Shield className="h-4 w-4 mr-2" />
      case "code":
        return <Code className="h-4 w-4 mr-2" />
      case "query":
        return <Search className="h-4 w-4 mr-2" />
      case "analysis":
        return <BarChart className="h-4 w-4 mr-2" />
      default:
        return <MessageSquare className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">API智能助手</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadChat}
            disabled={messages.length <= 2}
          >
            <Download className="h-4 w-4 mr-2" />
            下载记录
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            disabled={messages.length <= 2}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清空记录
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            设置
            {showSettings ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">助手设置</CardTitle>
            <CardDescription>配置AI模型和响应参数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model-select">AI模型</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="选择AI模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (高级)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (快速)</SelectItem>
                    <SelectItem value="claude-3">Claude 3 (精准)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature-slider">创造性 ({temperature})</Label>
                </div>
                <Slider
                  id="temperature-slider"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>精确</span>
                  <span>平衡</span>
                  <span>创造</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="stream-toggle"
                  checked={streamResponse}
                  onCheckedChange={setStreamResponse}
                />
                <Label htmlFor="stream-toggle">流式响应</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            通用对话
          </TabsTrigger>
          <TabsTrigger value="documentation">
            <FileText className="h-4 w-4 mr-2" />
            文档生成
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            安全分析
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            代码生成
          </TabsTrigger>
          <TabsTrigger value="query">
            <Search className="h-4 w-4 mr-2" />
            自然语言查询
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart className="h-4 w-4 mr-2" />
            API分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 flex flex-col space-y-4 mt-0">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                {getTabIcon(activeTab)}
                {activeTab === "chat" ? "通用对话" : 
                 activeTab === "documentation" ? "API文档生成" :
                 activeTab === "security" ? "API安全分析" :
                 activeTab === "code" ? "客户端代码生成" :
                 activeTab === "query" ? "自然语言查询" : "API使用分析"}
              </CardTitle>
              <CardDescription>
                {activeTab === "chat" ? "与AI助手进行通用对话，获取API相关建议" : 
                 activeTab === "documentation" ? "生成API文档，包括OpenAPI规范和Markdown格式" :
                 activeTab === "security" ? "分析API安全性，识别潜在漏洞和安全风险" :
                 activeTab === "code" ? "为您的API生成各种编程语言的客户端代码" :
                 activeTab === "query" ? "使用自然语言查询API数据和功能" : "分析API使用模式和性能问题"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4 space-y-4">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholderByTab(activeTab)}
                    className="min-h-[100px] pr-12 resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    className="absolute bottom-2 right-2"
                    size="icon"
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">示例提示:</p>
                  {renderExamplePrompts()}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    <span>使用 {selectedModel} 模型</span>
                  </div>
                  <span>按 Ctrl+Enter 发送</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

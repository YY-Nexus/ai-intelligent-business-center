"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Code, Copy, Download, RefreshCw, Trash2, Play, Pause } from "lucide-react"
import { CodeGeeXClient } from "@/lib/api-binding/providers/zhipu/codegeex-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CodeGeeXDemo() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("typescript")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [topP, setTopP] = useState(0.9)
  const [useStream, setUseStream] = useState(true)
  const [streamPaused, setStreamPaused] = useState(false)
  const [codeHistory, setCodeHistory] = useState<
    Array<{
      prompt: string
      code: string
      language: string
      timestamp: number
    }>
  >([])
  const [activeTab, setActiveTab] = useState("generate")

  const streamController = useRef<AbortController | null>(null)
  const supportedLanguages = CodeGeeXClient.getSupportedLanguages()

  useEffect(() => {
    // 从localStorage加载API密钥
    const savedApiKey = localStorage.getItem("codegeex_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // 从localStorage加载历史记录
    const savedHistory = localStorage.getItem("codegeex_history")
    if (savedHistory) {
      try {
        setCodeHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("加载历史记录失败:", e)
      }
    }
  }, [])

  useEffect(() => {
    // 保存历史记录到localStorage
    localStorage.setItem("codegeex_history", JSON.stringify(codeHistory))
  }, [codeHistory])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("codegeex_api_key", apiKey)
      toast({
        title: "API密钥已保存",
        description: "您的API密钥已保存到本地存储",
      })
    }
  }

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "提示文本缺失",
        description: "请输入代码需求描述",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setGeneratedCode("")
    setStreamPaused(false)

    try {
      const client = new CodeGeeXClient({ apiKey })

      if (useStream) {
        // 创建新的AbortController
        streamController.current = new AbortController()

        await client.streamGenerateCode(
          {
            prompt,
            language,
            temperature,
            maxTokens,
            topP,
          },
          // 处理流数据
          (text) => {
            if (!streamPaused) {
              setGeneratedCode((prev) => prev + text)
            }
          },
          // 完成回调
          (fullText) => {
            setIsLoading(false)
            // 添加到历史记录
            setCodeHistory((prev) =>
              [
                {
                  prompt,
                  code: fullText,
                  language,
                  timestamp: Date.now(),
                },
                ...prev,
              ].slice(0, 20),
            ) // 只保留最近20条记录
          },
          // 错误回调
          (error) => {
            setIsLoading(false)
            toast({
              title: "生成失败",
              description: error,
              variant: "destructive",
            })
          },
        )
      } else {
        const result = await client.generateCode({
          prompt,
          language,
          temperature,
          maxTokens,
          topP,
        })

        if (!result.success) {
          throw new Error(result.error || "生成失败")
        }

        if (result.data.choices && result.data.choices.length > 0) {
          const code = result.data.choices[0].text
          setGeneratedCode(code)

          // 添加到历史记录
          setCodeHistory((prev) =>
            [
              {
                prompt,
                code,
                language,
                timestamp: Date.now(),
              },
              ...prev,
            ].slice(0, 20),
          ) // 只保留最近20条记录
        } else {
          toast({
            title: "生成失败",
            description: "模型未返回有效代码",
            variant: "destructive",
          })
        }

        setIsLoading(false)
      }
    } catch (error) {
      console.error("API请求失败:", error)
      toast({
        title: "请求失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const toggleStreamPause = () => {
    setStreamPaused(!streamPaused)
  }

  const stopGeneration = () => {
    if (streamController.current) {
      streamController.current.abort()
      streamController.current = null
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setCodeHistory([])
    localStorage.removeItem("codegeex_history")
    toast({
      title: "历史记录已清除",
      description: "所有生成历史已被删除",
    })
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "已复制",
      description: "代码已复制到剪贴板",
    })
  }

  const downloadCode = (code: string, lang: string) => {
    const fileExtension = getFileExtension(lang)
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `code-${Date.now()}.${fileExtension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileExtension = (lang: string): string => {
    switch (lang) {
      case "typescript":
        return "ts"
      case "javascript":
        return "js"
      case "python":
        return "py"
      case "java":
        return "java"
      case "cpp":
        return "cpp"
      case "go":
        return "go"
      case "rust":
        return "rs"
      case "sql":
        return "sql"
      case "html":
        return "html"
      case "css":
        return "css"
      case "php":
        return "php"
      case "csharp":
        return "cs"
      case "swift":
        return "swift"
      case "kotlin":
        return "kt"
      default:
        return "txt"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>CodeGeeX-4 代码生成</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="generate">生成代码</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                  代码需求描述
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述您需要生成的代码功能，例如：'实现一个快速排序算法'"
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium mb-1">
                    编程语言
                  </label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择编程语言" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>创造性: {Math.round(temperature * 100)}%</Label>
                  <Slider
                    value={[temperature]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setTemperature(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    较低的值会产生更确定性的结果，较高的值会增加创造性和多样性
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>最大令牌数: {maxTokens}</Label>
                  <Slider
                    value={[maxTokens]}
                    min={256}
                    max={4096}
                    step={256}
                    onValueChange={(value) => setMaxTokens(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">控制生成代码的最大长度</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>流式响应</Label>
                    <Switch checked={useStream} onCheckedChange={setUseStream} />
                  </div>
                  <p className="text-xs text-muted-foreground">启用流式响应可以实时查看生成过程</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              {codeHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">生成历史 ({codeHistory.length})</h3>
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      清除历史
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {codeHistory.map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">
                                {supportedLanguages.find((l) => l.value === item.language)?.label || item.language}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline" onClick={() => copyCode(item.code)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => downloadCode(item.code, item.language)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-0">
                          <p className="text-xs mb-2 text-muted-foreground line-clamp-2">{item.prompt}</p>
                          <div className="bg-muted rounded-md p-2 max-h-[200px] overflow-auto">
                            <pre className="text-xs">
                              <code>{item.code}</code>
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无生成历史</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-4">
                <div>
                  <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                    智谱AI API密钥
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="输入您的智谱AI API密钥"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveApiKey}>保存</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">API密钥将安全地存储在您的浏览器本地存储中</p>
                </div>

                <div className="space-y-2">
                  <Label>Top-P: {topP}</Label>
                  <Slider value={[topP]} min={0.1} max={1} step={0.1} onValueChange={(value) => setTopP(value[0])} />
                  <p className="text-xs text-muted-foreground">控制生成文本的多样性，较低的值会使输出更加确定</p>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">关于CodeGeeX-4</h3>
                  <p className="text-sm text-muted-foreground">
                    CodeGeeX-4是智谱AI开发的先进代码生成模型，支持多种编程语言，能够根据自然语言描述生成高质量的代码。
                    该模型具有强大的中文理解能力，可以准确理解复杂的中文需求并生成相应的代码实现。
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {activeTab === "generate" && (
            <div className="w-full flex gap-2">
              <Button onClick={handleSubmit} disabled={isLoading && !useStream} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    生成代码
                  </>
                )}
              </Button>

              {useStream && isLoading && (
                <>
                  <Button variant="outline" onClick={toggleStreamPause}>
                    {streamPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={stopGeneration}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {generatedCode && activeTab === "generate" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle>生成结果</CardTitle>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => copyCode(generatedCode)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => downloadCode(generatedCode, language)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <pre className="text-sm font-mono">
                <code>{generatedCode}</code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

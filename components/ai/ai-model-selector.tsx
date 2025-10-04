"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquare, ImageIcon, Code, RefreshCw, Download, Copy, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAIConfig } from "@/lib/ai/ai-config-manager"
import OpenAIClient from "@/lib/ai/openai-client"
import GLM4VClient from "@/lib/ai/glm4v-client"
import CogViewClient from "@/lib/ai/cogview-client"
import CodeGeeXClient from "@/lib/ai/codegeex-client"

interface AiModelSelectorProps {
  apiKey?: string
}

export function AiModelSelector({ apiKey }: AiModelSelectorProps) {
  const { toast } = useToast()
  const { models, activeModelId, getActiveModelConfig } = useAIConfig()
  const [activeTab, setActiveTab] = useState("chat")
  const [isLoading, setIsLoading] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [imagePrompt, setImagePrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [codePrompt, setCodePrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [codeLanguage, setCodeLanguage] = useState("typescript")
  const [imageWidth, setImageWidth] = useState(512)
  const [imageHeight, setImageHeight] = useState(512)
  const [negativePrompt, setNegativePrompt] = useState("")
  const [temperature, setTemperature] = useState(0.7)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeModel = getActiveModelConfig()
  const effectiveApiKey = apiKey || activeModel?.apiKey

  useEffect(() => {
    // 如果没有API密钥，显示错误
    if (!effectiveApiKey) {
      setError("未设置API密钥，请在模型管理页面设置API密钥")
    } else {
      setError(null)
    }
  }, [effectiveApiKey])

  // 发送聊天消息
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !effectiveApiKey) return

    const userMessage = chatInput.trim()
    setChatInput("")
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setError(null)

    try {
      let response = ""

      if (activeModel?.provider.toLowerCase() === "智谱ai" && activeModel.id.includes("glm")) {
        // 使用GLM4V
        const client = new GLM4VClient(effectiveApiKey)
        const result = await client.chat([
          ...chatHistory.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: userMessage },
        ])
        response = result.choices[0].message.content
      } else if (activeModel?.provider.toLowerCase() === "openai") {
        // 使用OpenAI
        const client = new OpenAIClient(effectiveApiKey)
        const result = await client.createChatCompletion({
          model: activeModel.id,
          messages: [
            ...chatHistory.map((msg) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: userMessage },
          ],
          temperature: temperature,
        })
        response = result.choices[0].message.content
      } else {
        throw new Error("不支持的模型类型")
      }

      setChatHistory((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error: any) {
      setError(error.message || "发送消息时出错")
      toast({
        title: "聊天失败",
        description: error.message || "发送消息时出错",
        variant: "destructive",
      })
      console.error("聊天失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 生成图像
  const generateImage = async () => {
    if (!imagePrompt.trim() || !effectiveApiKey) return

    setIsLoading(true)
    setGeneratedImages([])
    setError(null)

    try {
      let imageUrls: string[] = []

      if (activeModel?.provider.toLowerCase() === "智谱ai" && activeModel.id.includes("cogview")) {
        // 使用CogView
        const client = new CogViewClient({ apiKey: effectiveApiKey })
        const response = await client.generateImage({
          prompt: imagePrompt,
          size: `${imageWidth}x${imageHeight}`,
          negative_prompt: negativePrompt,
          quality: "hd",
        })

        if (!response.success) {
          throw new Error(response.error || "生成失败")
        }

        imageUrls = response.data.data.map((item) => item.url)
      } else if (activeModel?.provider.toLowerCase() === "openai") {
        // 使用OpenAI DALL-E
        const client = new OpenAIClient(effectiveApiKey)
        const response = await client.createImage({
          prompt: imagePrompt,
          model: "dall-e-3",
          size: "1024x1024",
          quality: "standard",
          n: 1,
        })

        imageUrls = response.data.map((item) => item.url || "")
      } else {
        throw new Error("不支持的模型类型")
      }

      setGeneratedImages(imageUrls.filter(Boolean))

      if (imageUrls.length === 0) {
        toast({
          title: "生成失败",
          description: "模型未返回有效图像",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setError(error.message || "生成图像时出错")
      toast({
        title: "图像生成失败",
        description: error.message || "生成图像时出错",
        variant: "destructive",
      })
      console.error("图像生成失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 生成代码
  const generateCode = async () => {
    if (!codePrompt.trim() || !effectiveApiKey) return

    setIsLoading(true)
    setGeneratedCode("")
    setError(null)

    try {
      let code = ""

      if (activeModel?.provider.toLowerCase() === "智谱ai" && activeModel.id.includes("codegeex")) {
        // 使用CodeGeeX
        const client = new CodeGeeXClient({ apiKey: effectiveApiKey })
        const response = await client.generateCode({
          prompt: codePrompt,
          language: codeLanguage,
          max_tokens: 2048,
          temperature: temperature,
        })

        if (!response.success) {
          throw new Error(response.error || "生成失败")
        }

        if (response.data.choices && response.data.choices.length > 0) {
          code = response.data.choices[0].text
        } else {
          throw new Error("模型未返回有效代码")
        }
      } else if (activeModel?.provider.toLowerCase() === "openai") {
        // 使用OpenAI
        const client = new OpenAIClient(effectiveApiKey)
        const result = await client.createChatCompletion({
          model: activeModel.id,
          messages: [
            {
              role: "system",
              content: `你是一个代码生成助手。请生成${codeLanguage}代码，只返回代码，不要有任何解释。`,
            },
            { role: "user", content: codePrompt },
          ],
          temperature: temperature,
        })
        code = result.choices[0].message.content
      } else {
        throw new Error("不支持的模型类型")
      }

      setGeneratedCode(code)
    } catch (error: any) {
      setError(error.message || "生成代码时出错")
      toast({
        title: "代码生成失败",
        description: error.message || "生成代码时出错",
        variant: "destructive",
      })
      console.error("代码生成失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 复制内容
  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板",
    })
  }

  // 下载图像
  const downloadImage = (url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 清除聊天历史
  const clearChatHistory = () => {
    setChatHistory([])
    toast({
      title: "已清除",
      description: "聊天历史已清除",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI模型工具箱</CardTitle>
        <CardDescription>使用{activeModel?.name || "当前选择的模型"}完成不同任务</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 border border-red-200 rounded-md bg-red-50 text-red-800 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              智能对话
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="h-4 w-4 mr-2" />
              图像生成
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              代码生成
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="h-[400px] overflow-y-auto border rounded-md p-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>开始与AI对话</p>
                    <p className="text-sm">输入问题并点击发送按钮开始对话</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="输入消息..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1"
                disabled={isLoading || !effectiveApiKey}
              />
              <div className="flex flex-col gap-2">
                <Button onClick={sendChatMessage} disabled={isLoading || !chatInput.trim() || !effectiveApiKey}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "发送"}
                </Button>
                <Button variant="outline" onClick={clearChatHistory} disabled={isLoading || chatHistory.length === 0}>
                  清除
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-prompt">图像描述</Label>
                <Textarea
                  id="image-prompt"
                  placeholder="描述你想要生成的图像..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="h-20"
                  disabled={isLoading || !effectiveApiKey}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={advancedMode}
                  onCheckedChange={setAdvancedMode}
                  disabled={!effectiveApiKey}
                />
                <Label htmlFor="advanced-mode">高级选项</Label>
              </div>

              {advancedMode && (
                <div className="space-y-4 p-4 border rounded-md">
                  <div>
                    <Label htmlFor="negative-prompt">负面提示词</Label>
                    <Textarea
                      id="negative-prompt"
                      placeholder="指定不希望出现在图像中的元素..."
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="h-20"
                      disabled={isLoading || !effectiveApiKey}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>图像宽度: {imageWidth}px</Label>
                      <Slider
                        value={[imageWidth]}
                        min={256}
                        max={1024}
                        step={64}
                        onValueChange={(value) => setImageWidth(value[0])}
                        disabled={isLoading || !effectiveApiKey}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>图像高度: {imageHeight}px</Label>
                      <Slider
                        value={[imageHeight]}
                        min={256}
                        max={1024}
                        step={64}
                        onValueChange={(value) => setImageHeight(value[0])}
                        disabled={isLoading || !effectiveApiKey}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={generateImage}
                disabled={isLoading || !imagePrompt.trim() || !effectiveApiKey}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    生成图像
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {generatedImages.length > 0 ? (
                generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`生成的图像 ${index + 1}`}
                      className="w-full h-auto rounded-md"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => downloadImage(imageUrl)}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground border rounded-md">
                  <div>
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>输入描述并点击"生成图像"</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="code-prompt">代码需求描述</Label>
                <Textarea
                  id="code-prompt"
                  placeholder="描述你需要生成的代码功能..."
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  className="h-20"
                  disabled={isLoading || !effectiveApiKey}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code-language">编程语言</Label>
                  <Select value={codeLanguage} onValueChange={setCodeLanguage} disabled={isLoading || !effectiveApiKey}>
                    <SelectTrigger id="code-language">
                      <SelectValue placeholder="选择编程语言" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
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
                    disabled={isLoading || !effectiveApiKey}
                  />
                </div>
              </div>

              <Button
                onClick={generateCode}
                disabled={isLoading || !codePrompt.trim() || !effectiveApiKey}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    生成代码
                  </>
                )}
              </Button>
            </div>

            {generatedCode ? (
              <div className="relative">
                <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                  <code className="text-sm font-mono whitespace-pre">{generatedCode}</code>
                </pre>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => copyContent(generatedCode)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground border rounded-md">
                <div>
                  <Code className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>输入需求并点击"生成代码"</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {activeTab === "chat" ? "使用AI进行智能对话" : activeTab === "image" ? "使用AI生成图像" : "使用AI生成代码"}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (activeTab === "chat") {
              clearChatHistory()
            } else if (activeTab === "image") {
              setGeneratedImages([])
              setImagePrompt("")
            } else {
              setGeneratedCode("")
              setCodePrompt("")
            }
            setError(null)
          }}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          重置
        </Button>
      </CardFooter>
    </Card>
  )
}

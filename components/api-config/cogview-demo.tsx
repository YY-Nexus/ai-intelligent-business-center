"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Wand2, Download, Trash2 } from "lucide-react"
import { CogViewClient } from "@/lib/api-binding/providers/zhipu/cogview-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CogViewDemo() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [prompt, setPrompt] = useState("")
  const [quality, setQuality] = useState<"standard" | "hd">("standard")
  const [size, setSize] = useState("1024x1024")
  const [customSize, setCustomSize] = useState("")
  const [isCustomSize, setIsCustomSize] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSize, setIsValidSize] = useState(true)
  const [negativePrompt, setNegativePrompt] = useState("")
  const [steps, setSteps] = useState(30)
  const [seed, setSeed] = useState<number | null>(null)
  const [useRandomSeed, setUseRandomSeed] = useState(true)
  const [generationHistory, setGenerationHistory] = useState<
    Array<{
      prompt: string
      imageUrl: string
      timestamp: number
    }>
  >([])
  const [activeTab, setActiveTab] = useState("generate")

  const recommendedSizes = CogViewClient.getRecommendedSizes()

  useEffect(() => {
    // 从localStorage加载API密钥
    const savedApiKey = localStorage.getItem("cogview_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // 从localStorage加载历史记录
    const savedHistory = localStorage.getItem("cogview_history")
    if (savedHistory) {
      try {
        setGenerationHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("加载历史记录失败:", e)
      }
    }
  }, [])

  useEffect(() => {
    // 保存历史记录到localStorage
    localStorage.setItem("cogview_history", JSON.stringify(generationHistory))
  }, [generationHistory])

  useEffect(() => {
    if (isCustomSize && customSize) {
      setIsValidSize(CogViewClient.validateImageSize(customSize))
    } else {
      setIsValidSize(true)
    }
  }, [customSize, isCustomSize])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("cogview_api_key", apiKey)
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
        description: "请输入图像描述",
        variant: "destructive",
      })
      return
    }

    const selectedSize = isCustomSize ? customSize : size
    if (isCustomSize && !isValidSize) {
      toast({
        title: "无效的图像尺寸",
        description: "图像尺寸必须在512px-2048px之间，能被16整除，且总像素数不超过2^21",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setImageUrl("")

    try {
      const client = new CogViewClient({ apiKey })
      const result = await client.generateImage({
        prompt,
        quality,
        size: selectedSize,
        negativePrompt,
        steps,
        seed: useRandomSeed ? undefined : seed || 0,
      })

      if (!result.success) {
        throw new Error(result.error || "生成失败")
      }

      if (result.data.data && result.data.data.length > 0) {
        const newImageUrl = result.data.data[0].url
        setImageUrl(newImageUrl)

        // 添加到历史记录
        setGenerationHistory((prev) =>
          [
            {
              prompt,
              imageUrl: newImageUrl,
              timestamp: Date.now(),
            },
            ...prev,
          ].slice(0, 20),
        ) // 只保留最近20条记录
      } else {
        toast({
          title: "生成失败",
          description: "模型未返回有效图像",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("API请求失败:", error)
      toast({
        title: "请求失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setGenerationHistory([])
    localStorage.removeItem("cogview_history")
    toast({
      title: "历史记录已清除",
      description: "所有生成历史已被删除",
    })
  }

  const downloadImage = (url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `cogview-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>CogView-3 图像生成</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="generate">生成图像</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                  图像描述
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述您想要生成的图像，例如：'一只可爱的小猫咪'"
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label htmlFor="negative-prompt" className="block text-sm font-medium mb-1">
                  负面提示词
                </label>
                <Textarea
                  id="negative-prompt"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="指定不希望出现在图像中的元素，例如：'模糊, 变形, 低质量'"
                  className="min-h-[60px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quality" className="block text-sm font-medium mb-1">
                    图像质量
                  </label>
                  <Select value={quality} onValueChange={(value) => setQuality(value as "standard" | "hd")}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择图像质量" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">标准 (5-10秒)</SelectItem>
                      <SelectItem value="hd">高清 (约20秒)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    高清模式生成更精细、细节更丰富的图像，整体一致性更高
                  </p>
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium mb-1">
                    图像尺寸
                  </label>
                  {!isCustomSize ? (
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择图像尺寸" />
                      </SelectTrigger>
                      <SelectContent>
                        {recommendedSizes.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">自定义尺寸</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="宽x高，例如：1024x768"
                      className={`w-full ${!isValidSize && customSize ? "border-red-500" : ""}`}
                    />
                  )}
                  <div className="flex items-center mt-1">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-xs"
                      onClick={() => {
                        setIsCustomSize(!isCustomSize)
                        if (isCustomSize) {
                          setSize("1024x1024")
                        } else {
                          setCustomSize("1024x768")
                        }
                      }}
                    >
                      {isCustomSize ? "使用推荐尺寸" : "使用自定义尺寸"}
                    </Button>
                  </div>
                  {isCustomSize && !isValidSize && customSize && (
                    <p className="text-xs text-red-500 mt-1">
                      尺寸必须在512px-2048px之间，能被16整除，且总像素数不超过2^21
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>迭代步数: {steps}</Label>
                  <Slider value={[steps]} min={10} max={50} step={1} onValueChange={(value) => setSteps(value[0])} />
                  <p className="text-xs text-muted-foreground">
                    更多的步数通常会产生更高质量的图像，但需要更长的生成时间
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>随机种子</Label>
                    <Switch checked={useRandomSeed} onCheckedChange={setUseRandomSeed} />
                  </div>

                  <Input
                    type="number"
                    value={seed !== null ? seed : ""}
                    onChange={(e) => setSeed(e.target.value ? Number.parseInt(e.target.value) : null)}
                    placeholder="输入种子数值"
                    disabled={useRandomSeed}
                  />
                  <p className="text-xs text-muted-foreground">使用相同的种子可以生成相似的图像，便于调整和比较</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              {generationHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">生成历史 ({generationHistory.length})</h3>
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      清除历史
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generationHistory.map((item, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="aspect-square relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 right-0 p-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="bg-black/50 hover:bg-black/70"
                              onClick={() => downloadImage(item.imageUrl)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-xs line-clamp-2">{item.prompt}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
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

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">关于CogView-3</h3>
                  <p className="text-sm text-muted-foreground">
                    CogView-3是智谱AI开发的先进图像生成模型，支持通过文本描述生成高质量图像。
                    该模型具有强大的中文理解能力，可以准确理解复杂的中文描述并生成相应的图像。
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {activeTab === "generate" && (
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  生成图像
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {imageUrl && activeTab === "generate" && (
        <Card>
          <CardHeader>
            <CardTitle>生成结果</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative border rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl || "/placeholder.svg"} alt="生成的图像" className="max-w-full h-auto" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.open(imageUrl, "_blank")}>
              在新窗口打开
            </Button>
            <Button variant="secondary" onClick={() => downloadImage(imageUrl)}>
              下载图像
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

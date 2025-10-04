"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Loader2, ImageIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MultimodalPage() {
  // 图像识别状态
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagePrompt, setImagePrompt] = useState("这张图片里有什么？请详细描述。")
  const [imageResponse, setImageResponse] = useState("")
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState("")

  // 图像生成状态
  const [generationPrompt, setGenerationPrompt] = useState("一只可爱的熊猫在竹林中吃竹子，卡通风格")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generationLoading, setGenerationLoading] = useState(false)
  const [generationError, setGenerationError] = useState("")

  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      setImageError("请上传图片文件")
      return
    }

    // 检查文件大小 (限制为5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("图片大小不能超过5MB")
      return
    }

    setImageFile(file)
    setImageError("")

    // 创建预览URL
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // 清除已上传图片
  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 发送图像识别请求
  const handleImageRecognition = async () => {
    if (!imageFile) {
      setImageError("请先上传图片")
      return
    }

    try {
      setImageLoading(true)
      setImageError("")
      setImageResponse("")

      // 创建FormData对象
      const formData = new FormData()
      formData.append("image", imageFile)
      formData.append("prompt", imagePrompt)

      const response = await fetch("/api/zhipu/vision", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setImageResponse(data.message)
    } catch (err) {
      console.error("图像识别错误:", err)
      setImageError(err instanceof Error ? err.message : "图像识别失败")
    } finally {
      setImageLoading(false)
    }
  }

  // 发送图像生成请求
  const handleImageGeneration = async () => {
    if (!generationPrompt.trim()) {
      setGenerationError("请输入图像生成提示词")
      return
    }

    try {
      setGenerationLoading(true)
      setGenerationError("")
      setGeneratedImage(null)

      const response = await fetch("/api/zhipu/image-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: generationPrompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
    } catch (err) {
      console.error("图像生成错误:", err)
      setGenerationError(err instanceof Error ? err.message : "图像生成失败")
    } finally {
      setGenerationLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">智谱AI多模态能力示例</h1>
      <p className="text-muted-foreground">本示例展示了智谱AI的多模态能力，包括图像识别和图像生成功能。</p>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          多模态能力允许AI模型理解和生成不同类型的内容，如文本和图像。GLM-4V支持图像理解，CogView支持图像生成。
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="vision">
        <TabsList>
          <TabsTrigger value="vision">图像识别</TabsTrigger>
          <TabsTrigger value="generation">图像生成</TabsTrigger>
        </TabsList>

        <TabsContent value="vision" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>上传图片</CardTitle>
                <CardDescription>上传您想要AI分析的图片</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="预览"
                          className="max-h-[300px] mx-auto object-contain rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                          onClick={clearImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">点击或拖拽图片到此处上传</p>
                        <p className="text-xs text-muted-foreground">支持 JPG, PNG, WEBP 格式，最大 5MB</p>
                      </>
                    )}
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className={imagePreview ? "hidden" : "absolute inset-0 opacity-0 cursor-pointer"}
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {imageError && (
                  <Alert variant="destructive">
                    <AlertDescription>{imageError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="image-prompt">提示词</Label>
                  <Textarea
                    id="image-prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="输入关于图片的问题..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleImageRecognition} disabled={!imageFile || imageLoading} className="w-full">
                  {imageLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {imageLoading ? "分析中..." : "分析图片"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI分析结果</CardTitle>
                <CardDescription>智谱AI对图片的分析结果</CardDescription>
              </CardHeader>
              <CardContent>
                {imageResponse ? (
                  <ScrollArea className="h-[400px]">
                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">{imageResponse}</div>
                  </ScrollArea>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    {imageLoading ? "分析中..." : "上传图片并点击分析按钮获取结果"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generation" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>图像生成</CardTitle>
                <CardDescription>输入提示词生成图像</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="generation-prompt">提示词</Label>
                  <Textarea
                    id="generation-prompt"
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    placeholder="描述您想要生成的图像..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>提示词示例</Label>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div
                      className="p-2 bg-muted rounded-md cursor-pointer hover:bg-accent"
                      onClick={() => setGenerationPrompt("一只可爱的熊猫在竹林中吃竹子，卡通风格")}
                    >
                      一只可爱的熊猫在竹林中吃竹子，卡通风格
                    </div>
                    <div
                      className="p-2 bg-muted rounded-md cursor-pointer hover:bg-accent"
                      onClick={() => setGenerationPrompt("未来城市的天际线，科幻风格，黄昏时分")}
                    >
                      未来城市的天际线，科幻风格，黄昏时分
                    </div>
                    <div
                      className="p-2 bg-muted rounded-md cursor-pointer hover:bg-accent"
                      onClick={() => setGenerationPrompt("一杯冒着热气的咖啡，旁边放着一本书，温馨的咖啡馆场景")}
                    >
                      一杯冒着热气的咖啡，旁边放着一本书，温馨的咖啡馆场景
                    </div>
                  </div>
                </div>

                {generationError && (
                  <Alert variant="destructive">
                    <AlertDescription>{generationError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleImageGeneration} disabled={generationLoading} className="w-full">
                  {generationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {generationLoading ? "生成中..." : "生成图像"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>生成结果</CardTitle>
                <CardDescription>AI生成的图像</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                  {generatedImage ? (
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="生成的图像"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      {generationLoading ? "生成中..." : "输入提示词并点击生成按钮获取结果"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

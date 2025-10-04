"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, ImageIcon, Video, MessageSquare } from "lucide-react"
import { GLM4VClient } from "@/lib/api-binding/providers/glm4v/glm4v-client"

export default function GLM4VDemo() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [mediaUrl, setMediaUrl] = useState("")
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("image")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    if (!mediaUrl.trim()) {
      toast({
        title: "媒体URL缺失",
        description: "请输入图片或视频URL",
        variant: "destructive",
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "提示文本缺失",
        description: "请输入提示文本",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse("")

    try {
      const client = new GLM4VClient(apiKey)
      let result

      if (activeTab === "image") {
        result = await client.imageUnderstanding(mediaUrl, prompt)
      } else if (activeTab === "video") {
        result = await client.videoUnderstanding(mediaUrl, prompt)
      } else {
        toast({
          title: "不支持的媒体类型",
          description: "当前只支持图片和视频理解",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (result.data.choices && result.data.choices.length > 0 && result.data.choices[0].message) {
        setResponse(result.data.choices[0].message.content)
      } else {
        setResponse("模型未返回有效响应")
      }
    } catch (error) {
      console.error("API请求失败:", error)
      toast({
        title: "请求失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      setResponse("请求失败: " + (error instanceof Error ? error.message : "未知错误"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleStreamSubmit = async () => {
    if (!apiKey.trim() || !mediaUrl.trim() || !prompt.trim()) {
      toast({
        title: "输入不完整",
        description: "请确保填写了API密钥、媒体URL和提示文本",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse("")

    try {
      const client = new GLM4VClient(apiKey)

      if (activeTab === "image") {
        await client.streamChat(
          {
            stream: true,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: mediaUrl,
                    },
                  },
                  {
                    type: "text",
                    text: prompt,
                  },
                ],
              },
            ],
          },
          (chunk) => {
            if (chunk.choices && chunk.choices.length > 0 && chunk.choices[0].delta) {
              const content = chunk.choices[0].delta.content || ""
              setResponse((prev) => prev + content)
            }
          },
        )
      } else if (activeTab === "video") {
        await client.streamChat(
          {
            stream: true,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "video_url",
                    video_url: {
                      url: mediaUrl,
                    },
                  },
                  {
                    type: "text",
                    text: prompt,
                  },
                ],
              },
            ],
          },
          (chunk) => {
            if (chunk.choices && chunk.choices.length > 0 && chunk.choices[0].delta) {
              const content = chunk.choices[0].delta.content || ""
              setResponse((prev) => prev + content)
            }
          },
        )
      }
    } catch (error) {
      console.error("流式API请求失败:", error)
      toast({
        title: "请求失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      setResponse("请求失败: " + (error instanceof Error ? error.message : "未知错误"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>GLM-4V 模型演示</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                智谱AI API密钥
              </label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="输入您的智谱AI API密钥"
                className="w-full"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="image">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  图像理解
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  视频理解
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="image-url" className="block text-sm font-medium mb-1">
                      图片URL
                    </label>
                    <Input
                      id="image-url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="输入图片URL或Base64编码"
                      className="w-full"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    支持jpg、png、jpeg格式，每张图像5M以下，像素不超过6000*6000
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="video-url" className="block text-sm font-medium mb-1">
                      视频URL
                    </label>
                    <Input
                      id="video-url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="输入视频URL或Base64编码"
                      className="w-full"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">支持mp4格式，视频大小限制为200M以内</div>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                提示文本
              </label>
              <Textarea
                id="prompt"
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="输入您的提示文本，例如：'请描述这个图片'"
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit} disabled={isLoading} className="mr-2">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                发送
              </>
            )}
          </Button>
          <Button onClick={handleStreamSubmit} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                流式输出
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>模型响应</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{response}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

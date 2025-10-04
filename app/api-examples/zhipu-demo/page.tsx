"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function ZhipuDemoPage() {
  const [prompt, setPrompt] = useState("你好，请简要介绍一下智谱AI")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [streamingResponse, setStreamingResponse] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const callZhipuAPI = async (useStream = false) => {
    try {
      if (useStream) {
        setStreamingResponse("")
        setIsStreaming(true)
        setError("")

        const response = await fetch("/api/zhipu/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error("Cannot read response")

        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          setStreamingResponse((prev) => prev + text)
        }
      } else {
        setLoading(true)
        setError("")

        const response = await fetch("/api/zhipu/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setResponse(data.message)
      }
    } catch (err) {
      console.error("Error calling ZhiPu API:", err)
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
      setIsStreaming(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">智谱AI API 演示</h1>
      <p className="text-muted-foreground">
        这个演示展示了如何在 Next.js 应用中集成智谱AI的 API。支持常规调用和流式响应。
      </p>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          此演示使用服务端API路由来保护您的API密钥。永远不要在客户端代码中直接使用您的API密钥。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>输入提示词</CardTitle>
          <CardDescription>输入您想要发送给智谱AI的提示词</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入提示词..."
            className="min-h-[100px]"
          />
          <div className="flex space-x-4">
            <Button onClick={() => callZhipuAPI(false)} disabled={loading || isStreaming}>
              {loading ? "处理中..." : "发送请求"}
            </Button>
            <Button variant="outline" onClick={() => callZhipuAPI(true)} disabled={loading || isStreaming}>
              {isStreaming ? "接收中..." : "流式响应"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="standard">
        <TabsList>
          <TabsTrigger value="standard">标准响应</TabsTrigger>
          <TabsTrigger value="streaming">流式响应</TabsTrigger>
        </TabsList>
        <TabsContent value="standard" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API 响应</CardTitle>
              <CardDescription>标准API响应结果</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : response ? (
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto">
                  {response}
                </div>
              ) : (
                <p className="text-muted-foreground">API响应将显示在这里...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="streaming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>流式响应</CardTitle>
              <CardDescription>实时接收AI生成的内容</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[100px] max-h-[400px] overflow-y-auto">
                  {streamingResponse || (isStreaming ? "加载中..." : "流式响应将显示在这里...")}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ProviderTestPanel({ providers }) {
  const { toast } = useToast()
  const [selectedProvider, setSelectedProvider] = useState("")
  const [prompt, setPrompt] = useState("你好，请介绍一下你自己。")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [responseTime, setResponseTime] = useState(null)

  const handleTest = async () => {
    if (!selectedProvider) {
      toast({
        title: "请选择提供商",
        description: "请先选择一个AI提供商进行测试",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse("")
    setResponseTime(null)

    const startTime = Date.now()

    try {
      // 这里应该调用实际的API测试函数
      // 为了演示，我们使用setTimeout模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const provider = providers.find((p) => p.id === selectedProvider)
      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      setResponse(
        `这是来自${provider.name}的测试响应。\n\n我是一个AI助手，可以回答问题、提供信息和帮助完成各种任务。我基于大型语言模型训练，能够理解和生成人类语言。\n\n如果您有任何问题或需要帮助，请随时告诉我。`,
      )

      toast({
        title: "测试成功",
        description: `成功连接到${provider.name}并获得响应`,
      })
    } catch (error) {
      setResponse(`错误: ${error.message || "未知错误"}`)
      toast({
        title: "测试失败",
        description: error.message || "连接AI提供商时发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">选择提供商</label>
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue placeholder="选择AI提供商" />
          </SelectTrigger>
          <SelectContent>
            {providers
              .filter((provider) => provider.status === "active")
              .map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">测试提示词</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="输入测试提示词..."
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={handleTest} disabled={isLoading || !selectedProvider}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            测试中...
          </>
        ) : (
          "发送测试请求"
        )}
      </Button>

      {(response || isLoading) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">响应结果</h3>
                {responseTime && <span className="text-xs text-muted-foreground">响应时间: {responseTime}ms</span>}
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Textarea value={response} readOnly className="min-h-[200px] resize-none" />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

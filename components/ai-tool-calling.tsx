"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Wrench } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
}

export function AIToolCalling() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // 添加用户消息
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("请求失败")
      }

      const data = await response.json()

      // 添加助手消息
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])

      // 如果有天气数据，则设置
      if (data.weatherData) {
        setWeatherData(data.weatherData)
      }
    } catch (error) {
      console.error("工具调用错误:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，处理您的请求时出错了。请稍后再试。",
        },
      ])
    } finally {
      setInput("")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wrench className="mr-2 h-5 w-5 text-purple-500" />
          AI 工具调用
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            询问天气信息，AI 将调用天气工具获取数据。例如："北京今天的天气怎么样？"
          </p>

          <ScrollArea className="h-[200px] rounded-md border p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-gray-500">
                <p>发送消息以开始对话</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {weatherData && (
            <div className="rounded-lg bg-blue-50 p-4 mt-4">
              <h3 className="text-lg font-semibold text-blue-700">天气信息</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <strong>地点:</strong> {weatherData.location}
                </p>
                <p>
                  <strong>温度:</strong> {weatherData.temperature}°C
                </p>
                <p>
                  <strong>天气状况:</strong> {weatherData.condition}
                </p>
                <p>
                  <strong>湿度:</strong> {weatherData.humidity}%
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="询问天气信息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "发送"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

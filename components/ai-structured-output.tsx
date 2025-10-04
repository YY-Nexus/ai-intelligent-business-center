"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, ListTree } from "lucide-react"

// 定义结构化输出的类型
interface MovieRecommendation {
  title: string
  year: number
  genre: string
  director: string
  description: string
  rating: number
}

export function AIStructuredOutput() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<MovieRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("请求失败")
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "发生错误")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListTree className="mr-2 h-5 w-5 text-green-500" />
          AI 结构化数据生成
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">输入一个电影类型或主题，AI 将生成一个结构化的电影推荐。</p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="例如：科幻电影、悬疑片、关于友情的电影..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "生成"}
            </Button>
          </form>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">错误: {error}</div>}

          {result && (
            <div className="rounded-lg border p-4 mt-4">
              <h3 className="text-xl font-bold">
                {result.title} ({result.year})
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{result.genre}</span>
                <span className="text-gray-500">导演: {result.director}</span>
                <span className="text-amber-500">★ {result.rating.toFixed(1)}/10</span>
              </div>
              <p className="mt-3 text-gray-700">{result.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

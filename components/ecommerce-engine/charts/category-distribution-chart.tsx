"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { Loader2, TrendingUp } from "lucide-react"

interface CategoryData {
  category: string
  value: number
  percentage: number
  color: string
}

export function CategoryDistributionChart() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/chart/category-distribution")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          setData(result.data)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (err) {
        console.error("Failed to fetch category distribution data:", err)
        setError(err instanceof Error ? err.message : "Unknown error")

        // Fallback to mock data for demo purposes
        setData([
          { category: "电子产品", value: 45000, percentage: 28.5, color: "#3b82f6" },
          { category: "服装鞋包", value: 38000, percentage: 24.1, color: "#8b5cf6" },
          { category: "家居生活", value: 32000, percentage: 20.3, color: "#06b6d4" },
          { category: "美妆护肤", value: 28000, percentage: 17.7, color: "#ec4899" },
          { category: "食品饮料", value: 25000, percentage: 15.8, color: "#10b981" },
          { category: "运动户外", value: 22000, percentage: 13.9, color: "#f59e0b" },
          { category: "图书文娱", value: 18000, percentage: 11.4, color: "#6366f1" },
          { category: "母婴用品", value: 15000, percentage: 9.5, color: "#14b8a6" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="smart-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            品类分布
          </CardTitle>
          <CardDescription>商品品类销售分布统计</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">加载数据中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && data.length === 0) {
    return (
      <Card className="smart-glow border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <TrendingUp className="h-5 w-5" />
            品类分布
          </CardTitle>
          <CardDescription className="text-red-600">加载失败: {error}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-sm text-muted-foreground">无法加载数据</p>
        </CardContent>
      </Card>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="smart-glow micro-interaction">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          品类分布
          <span className="text-sm font-normal text-muted-foreground">
            ({data.length} 个品类 · 总计 {total.toLocaleString()} 元)
          </span>
        </CardTitle>
        <CardDescription>商品品类销售分布统计 · 数据更新时间: {new Date().toLocaleString("zh-CN")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: "销售额 (元)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number, name: string, props: any) => [
                `¥${value.toLocaleString()}`,
                name === "value" ? "销售额" : name,
              ]}
              labelFormatter={(label) => `品类: ${label}`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} formatter={() => "销售额"} />
            <Bar dataKey="value" name="销售额" radius={[8, 8, 0, 0]} label={{ position: "top", fontSize: 10 }}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="transition-opacity hover:opacity-80" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium truncate">{item.category}</span>
              </div>
              <div className="text-lg font-bold">¥{item.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">占比 {item.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

// 健康趋势数据类型
interface HealthTrendData {
  date: string
  framework: number
  fileCompliance: number
  interaction: number
  missingFeatures: number
  performance: number
  security: number
  overall: number
}

// 模拟数据 - 在实际应用中应从API获取
const healthTrendDataOriginal: HealthTrendData[] = [
  {
    date: "2023-05-01",
    framework: 78,
    fileCompliance: 65,
    interaction: 82,
    missingFeatures: 45,
    performance: 70,
    security: 60,
    overall: 67,
  },
  {
    date: "2023-05-15",
    framework: 80,
    fileCompliance: 68,
    interaction: 85,
    missingFeatures: 48,
    performance: 72,
    security: 65,
    overall: 70,
  },
  {
    date: "2023-06-01",
    framework: 83,
    fileCompliance: 72,
    interaction: 87,
    missingFeatures: 52,
    performance: 75,
    security: 70,
    overall: 73,
  },
  {
    date: "2023-06-15",
    framework: 85,
    fileCompliance: 78,
    interaction: 88,
    missingFeatures: 58,
    performance: 78,
    security: 75,
    overall: 77,
  },
  {
    date: "2023-07-01",
    framework: 88,
    fileCompliance: 82,
    interaction: 90,
    missingFeatures: 65,
    performance: 82,
    security: 80,
    overall: 81,
  },
  {
    date: "2023-07-15",
    framework: 90,
    fileCompliance: 85,
    interaction: 92,
    missingFeatures: 70,
    performance: 85,
    security: 85,
    overall: 85,
  },
  {
    date: "2023-08-01",
    framework: 92,
    fileCompliance: 88,
    interaction: 94,
    missingFeatures: 75,
    performance: 88,
    security: 88,
    overall: 88,
  },
]

// 健康状态评估
interface HealthAssessment {
  category: string
  score: number
  previousScore: number
  change: number
  trend: "up" | "down" | "stable"
  status: "good" | "warning" | "critical"
  insights: string[]
}

export function HealthTrendAnalysis() {
  // 模拟健康趋势数据
  const healthTrendData = [
    {
      date: "2023-12-01",
      score: 72,
      issues: 15,
      fixed: 0,
      trend: "baseline",
    },
    {
      date: "2023-12-15",
      score: 68,
      issues: 18,
      fixed: 3,
      trend: "down",
    },
    {
      date: "2024-01-01",
      score: 75,
      issues: 14,
      fixed: 7,
      trend: "up",
    },
    {
      date: "2024-01-15",
      score: 79,
      issues: 12,
      fixed: 9,
      trend: "up",
    },
    {
      date: "2024-02-01",
      score: 83,
      issues: 9,
      fixed: 12,
      trend: "up",
    },
    {
      date: "2024-02-15",
      score: 85,
      issues: 8,
      fixed: 13,
      trend: "up",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-500">良好</Badge>
    } else if (score >= 60) {
      return <Badge className="bg-yellow-500">一般</Badge>
    } else {
      return <Badge className="bg-red-500">较差</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>系统健康趋势分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">日期</th>
                <th className="text-left py-3 px-4">健康评分</th>
                <th className="text-left py-3 px-4">状态</th>
                <th className="text-left py-3 px-4">问题数</th>
                <th className="text-left py-3 px-4">已修复</th>
                <th className="text-left py-3 px-4">趋势</th>
              </tr>
            </thead>
            <tbody>
              {healthTrendData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{item.date}</td>
                  <td className="py-3 px-4 font-medium">{item.score}%</td>
                  <td className="py-3 px-4">{getScoreBadge(item.score)}</td>
                  <td className="py-3 px-4">{item.issues}</td>
                  <td className="py-3 px-4">{item.fixed}</td>
                  <td className="py-3 px-4 flex items-center">
                    {getTrendIcon(item.trend)}
                    <span className="ml-1">
                      {item.trend === "up" ? "上升" : item.trend === "down" ? "下降" : "持平"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">健康趋势分析</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            系统健康度在过去3个月内呈现稳步上升趋势，从72%提升至85%，提升了13个百分点。主要改进来自于问题修复数量的增加，从0个增加到13个。建议继续关注剩余的8个问题，特别是高优先级问题，以进一步提高系统健康度。
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

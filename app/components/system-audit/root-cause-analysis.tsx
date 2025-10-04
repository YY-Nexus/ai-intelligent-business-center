"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export function RootCauseAnalysis() {
  // 模拟根因分析数据
  const rootCauseData = [
    {
      id: 1,
      issue: "CSRF防护缺失",
      category: "安全",
      severity: "高",
      rootCause: "表单提交缺少CSRF令牌验证机制",
      impact: "可能导致跨站请求伪造攻击，威胁用户数据安全",
      recommendation: "在所有表单中添加CSRF令牌验证，使用Next.js内置的CSRF保护机制",
    },
    {
      id: 2,
      issue: "环境变量配置不完整",
      category: "配置",
      severity: "中",
      rootCause: "缺少必要的环境变量定义和验证",
      impact: "可能导致生产环境配置错误，影响系统稳定性",
      recommendation: "创建完整的环境变量模板和验证机制，确保所有必要配置都已定义",
    },
    {
      id: 3,
      issue: "错误处理不完善",
      category: "用户体验",
      severity: "中",
      rootCause: "缺少统一的错误处理机制，特别是网络错误处理",
      impact: "用户遇到错误时没有清晰的反馈，影响用户体验",
      recommendation: "实现全局错误处理机制，为不同类型的错误提供友好的用户反馈",
    },
    {
      id: 4,
      issue: "数据导出功能缺失",
      category: "功能",
      severity: "低",
      rootCause: "未实现数据导出功能",
      impact: "用户无法导出数据进行离线分析或备份",
      recommendation: "添加数据导出功能，支持常见格式如CSV、Excel等",
    },
  ]

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "高":
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="mr-1 h-3 w-3" /> 高
          </Badge>
        )
      case "中":
        return (
          <Badge variant="outline" className="flex items-center bg-yellow-50">
            <AlertTriangle className="mr-1 h-3 w-3" /> 中
          </Badge>
        )
      case "低":
        return (
          <Badge variant="outline" className="flex items-center bg-green-50">
            <CheckCircle className="mr-1 h-3 w-3" /> 低
          </Badge>
        )
      default:
        return <Badge>{severity}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>问题根因分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rootCauseData.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{item.issue}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.category}</Badge>
                  {getSeverityBadge(item.severity)}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">根本原因：</span>
                  <span>{item.rootCause}</span>
                </div>
                <div>
                  <span className="font-medium">影响：</span>
                  <span>{item.impact}</span>
                </div>
                <div>
                  <span className="font-medium">建议：</span>
                  <span>{item.recommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UsageStatisticsChart() {
  const [period, setPeriod] = useState("30d")
  const [chartType, setChartType] = useState("calls")

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="calls" className="w-full sm:w-auto" onValueChange={setChartType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calls">API调用</TabsTrigger>
            <TabsTrigger value="cost">成本</TabsTrigger>
            <TabsTrigger value="errors">错误率</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select defaultValue="30d" onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="选择时间段" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">过去7天</SelectItem>
            <SelectItem value="30d">过去30天</SelectItem>
            <SelectItem value="90d">过去90天</SelectItem>
            <SelectItem value="1y">过去1年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[350px] w-full border rounded-md p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            这里将显示 {chartType === "calls" ? "API调用" : chartType === "cost" ? "成本" : "错误率"} 图表
          </p>
          <p className="text-sm text-muted-foreground">
            时间段:{" "}
            {period === "7d" ? "过去7天" : period === "30d" ? "过去30天" : period === "90d" ? "过去90天" : "过去1年"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">（实际项目中将集成图表库如Recharts或Chart.js）</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总调用次数"
          value={chartType === "calls" ? "45,782" : chartType === "cost" ? "¥4,325.67" : "2.3%"}
          change="+12.5%"
          trend="up"
        />
        <StatCard
          title="百度文心一言"
          value={chartType === "calls" ? "15,432" : chartType === "cost" ? "¥1,876.50" : "1.8%"}
          change="+8.2%"
          trend="up"
        />
        <StatCard
          title="讯飞星火"
          value={chartType === "calls" ? "12,654" : chartType === "cost" ? "¥1,245.30" : "2.1%"}
          change="-3.5%"
          trend="down"
        />
        <StatCard
          title="智谱AI"
          value={chartType === "calls" ? "8,976" : chartType === "cost" ? "¥765.40" : "3.2%"}
          change="+15.7%"
          trend="up"
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, change, trend }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className={`text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? "↗︎" : "↘︎"} {change}
        </p>
      </CardContent>
    </Card>
  )
}

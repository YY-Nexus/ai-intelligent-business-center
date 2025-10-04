"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const data = [
  { month: "1月", 销售额: 85, 平均值: 100 },
  { month: "2月", 销售额: 80, 平均值: 100 },
  { month: "3月", 销售额: 90, 平均值: 100 },
  { month: "4月", 销售额: 95, 平均值: 100 },
  { month: "5月", 销售额: 105, 平均值: 100 },
  { month: "6月", 销售额: 110, 平均值: 100 },
  { month: "7月", 销售额: 115, 平均值: 100 },
  { month: "8月", 销售额: 120, 平均值: 100 },
  { month: "9月", 销售额: 110, 平均值: 100 },
  { month: "10月", 销售额: 115, 平均值: 100 },
  { month: "11月", 销售额: 125, 平均值: 100 },
  { month: "12月", 销售额: 135, 平均值: 100 },
]

export function SeasonalityChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[70, 140]} />
          <Tooltip formatter={(value, name) => [value, name === "销售额" ? "销售指数" : "平均值"]} />
          <Legend />
          <ReferenceLine y={100} stroke="#888" strokeDasharray="3 3" label="平均水平" />
          <Bar dataKey="销售额" name="销售指数" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

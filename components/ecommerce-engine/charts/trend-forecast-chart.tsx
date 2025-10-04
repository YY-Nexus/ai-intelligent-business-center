"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts"

const data = [
  { month: "1月", 销售额: 120000, 预测: null },
  { month: "2月", 销售额: 132000, 预测: null },
  { month: "3月", 销售额: 145000, 预测: null },
  { month: "4月", 销售额: 160000, 预测: null },
  { month: "5月", 销售额: 178000, 预测: 178000 },
  { month: "6月", 销售额: null, 预测: 195000 },
  { month: "7月", 销售额: null, 预测: 215000 },
  { month: "8月", 销售额: null, 预测: 240000 },
  { month: "9月", 销售额: null, 预测: 270000 },
  { month: "10月", 销售额: null, 预测: 310000 },
  { month: "11月", 销售额: null, 预测: 360000 },
  { month: "12月", 销售额: null, 预测: 420000 },
]

export function TrendForecastChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <YAxis />
          <Tooltip formatter={(value) => [`¥${value}`, ""]} />
          <Legend />
          <ReferenceDot x="5月" y={178000} r={5} fill="#ef4444" stroke="none" />
          <Line type="monotone" dataKey="销售额" name="历史销售额" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
          <Line
            type="monotone"
            dataKey="预测"
            name="销售预测"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

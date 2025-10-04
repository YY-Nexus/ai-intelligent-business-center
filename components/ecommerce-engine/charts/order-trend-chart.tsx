"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "5月8日", 订单数: 12, 销售额: 5600 },
  { name: "5月9日", 订单数: 19, 销售额: 8900 },
  { name: "5月10日", 订单数: 15, 销售额: 7200 },
  { name: "5月11日", 订单数: 22, 销售额: 10500 },
  { name: "5月12日", 订单数: 28, 销售额: 13200 },
  { name: "5月13日", 订单数: 35, 销售额: 16800 },
  { name: "5月14日", 订单数: 32, 销售额: 15400 },
]

export function OrderTrendChart() {
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
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="订单数" stroke="#3b82f6" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="销售额" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "淘宝/天猫", 订单数: 530, 销售额: 68245 },
  { name: "抖音小店", 订单数: 389, 销售额: 45632 },
  { name: "自营网站", 订单数: 329, 销售额: 42371 },
]

export function OrderSourceChart() {
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
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip formatter={(value, name) => [value, name === "订单数" ? "订单数" : "销售额 (¥)"]} />
          <Legend />
          <Bar yAxisId="left" dataKey="订单数" fill="#3b82f6" />
          <Bar yAxisId="right" dataKey="销售额" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "1月", 电子产品: 4000, 时尚服饰: 2400, 家居用品: 2400 },
  { name: "2月", 电子产品: 3000, 时尚服饰: 1398, 家居用品: 2210 },
  { name: "3月", 电子产品: 2000, 时尚服饰: 9800, 家居用品: 2290 },
  { name: "4月", 电子产品: 2780, 时尚服饰: 3908, 家居用品: 2000 },
  { name: "5月", 电子产品: 1890, 时尚服饰: 4800, 家居用品: 2181 },
  { name: "6月", 电子产品: 2390, 时尚服饰: 3800, 家居用品: 2500 },
  { name: "7月", 电子产品: 3490, 时尚服饰: 4300, 家居用品: 2100 },
  { name: "8月", 电子产品: 4000, 时尚服饰: 2400, 家居用品: 2400 },
  { name: "9月", 电子产品: 3000, 时尚服饰: 1398, 家居用品: 2210 },
  { name: "10月", 电子产品: 2000, 时尚服饰: 9800, 家居用品: 2290 },
  { name: "11月", 电子产品: 2780, 时尚服饰: 3908, 家居用品: 2000 },
  { name: "12月", 电子产品: 1890, 时尚服饰: 4800, 家居用品: 2181 },
]

export function MarketTrendChart() {
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="电子产品" stroke="#3b82f6" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="时尚服饰" stroke="#ef4444" />
          <Line type="monotone" dataKey="家居用品" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

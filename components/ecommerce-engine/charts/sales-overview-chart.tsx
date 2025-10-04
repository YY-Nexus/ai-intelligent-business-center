"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { date: "5月8日", 销售额: 5600 },
  { date: "5月9日", 销售额: 8900 },
  { date: "5月10日", 销售额: 7200 },
  { date: "5月11日", 销售额: 10500 },
  { date: "5月12日", 销售额: 13200 },
  { date: "5月13日", 销售额: 16800 },
  { date: "5月14日", 销售额: 15400 },
]

export function SalesOverviewChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [`¥${value}`, "销售额"]} />
          <Legend />
          <Area type="monotone" dataKey="销售额" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

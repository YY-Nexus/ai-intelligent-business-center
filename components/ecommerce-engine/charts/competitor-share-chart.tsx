"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "我们", 市场份额: 25, 同比增长: 15 },
  { name: "竞争对手A", 市场份额: 30, 同比增长: 5 },
  { name: "竞争对手B", 市场份额: 20, 同比增长: -3 },
  { name: "竞争对手C", 市场份额: 15, 同比增长: 8 },
  { name: "其他", 市场份额: 10, 同比增长: -5 },
]

export function CompetitorShareChart() {
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="市场份额" fill="#3b82f6" />
          <Bar dataKey="同比增长" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

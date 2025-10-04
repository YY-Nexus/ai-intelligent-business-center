"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => {
  return [
    { name: "用户API", calls: Math.floor(Math.random() * 100000) + 300000 },
    { name: "产品API", calls: Math.floor(Math.random() * 80000) + 250000 },
    { name: "订单API", calls: Math.floor(Math.random() * 60000) + 200000 },
    { name: "支付API", calls: Math.floor(Math.random() * 40000) + 150000 },
    { name: "分析API", calls: Math.floor(Math.random() * 30000) + 100000 },
  ]
}

export function TopApisChart() {
  const [data, setData] = useState(generateData())

  useEffect(() => {
    // 模拟数据更新
    const interval = setInterval(() => {
      setData(generateData())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <XAxis
          type="number"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">API</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">调用量</span>
                      <span className="font-bold">{payload[0].value.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

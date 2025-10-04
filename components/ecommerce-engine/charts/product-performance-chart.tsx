"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

const data = [
  { subject: "搜索排名", A: 65, B: 85, fullMark: 100 },
  { subject: "点击率", A: 78, B: 90, fullMark: 100 },
  { subject: "转化率", A: 45, B: 75, fullMark: 100 },
  { subject: "评分", A: 70, B: 85, fullMark: 100 },
  { subject: "复购率", A: 30, B: 60, fullMark: 100 },
  { subject: "利润率", A: 60, B: 80, fullMark: 100 },
]

export function ProductPerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="当前表现" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
          <Radar name="优化后预期" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

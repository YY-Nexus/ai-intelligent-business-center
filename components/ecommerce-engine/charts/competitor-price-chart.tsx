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
  ReferenceLine,
} from "recharts"

const data = [
  { date: "4月15日", 我们: 299.99, 竞争对手A: 349.99, 竞争对手B: 289.99, 竞争对手C: 329.99, 竞争对手D: 309.99 },
  { date: "4月22日", 我们: 299.99, 竞争对手A: 349.99, 竞争对手B: 289.99, 竞争对手C: 339.99, 竞争对手D: 309.99 },
  { date: "4月29日", 我们: 299.99, 竞争对手A: 339.99, 竞争对手B: 289.99, 竞争对手C: 349.99, 竞争对手D: 299.99 },
  { date: "5月6日", 我们: 299.99, 竞争对手A: 329.99, 竞争对手B: 289.99, 竞争对手C: 349.99, 竞争对手D: 289.99 },
  { date: "5月13日", 我们: 299.99, 竞争对手A: 329.99, 竞争对手B: 289.99, 竞争对手C: 349.99, 竞争对手D: 279.99 },
]

export function CompetitorPriceChart() {
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
          <XAxis dataKey="date" />
          <YAxis domain={[260, 360]} />
          <Tooltip formatter={(value) => [`¥${value}`, "价格"]} />
          <Legend />
          <ReferenceLine y={299.99} stroke="#888" strokeDasharray="3 3" label="我们的价格" />
          <Line type="monotone" dataKey="我们" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="竞争对手A" stroke="#3b82f6" />
          <Line type="monotone" dataKey="竞争对手B" stroke="#f59e0b" />
          <Line type="monotone" dataKey="竞争对手C" stroke="#8b5cf6" />
          <Line type="monotone" dataKey="竞争对手D" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

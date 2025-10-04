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
  { price: 199.99, 销量: 450, 利润: 9000 },
  { price: 219.99, 销量: 420, 利润: 10500 },
  { price: 239.99, 销量: 380, 利润: 11400 },
  { price: 259.99, 销量: 350, 利润: 12250 },
  { price: 279.99, 销量: 310, 利润: 12400 },
  { price: 289.99, 销量: 290, 利润: 13050 },
  { price: 299.99, 销量: 270, 利润: 13500 },
  { price: 319.99, 销量: 230, 利润: 12650 },
  { price: 339.99, 销量: 190, 利润: 11400 },
  { price: 359.99, 销量: 150, 利润: 9750 },
  { price: 379.99, 销量: 120, 利润: 8400 },
]

export function PricingSimulationChart() {
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
          <XAxis dataKey="price" label={{ value: "价格 (¥)", position: "insideBottomRight", offset: -10 }} />
          <YAxis yAxisId="left" label={{ value: "销量", angle: -90, position: "insideLeft" }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "利润 (¥)", angle: 90, position: "insideRight" }}
          />
          <Tooltip formatter={(value, name) => [value, name === "销量" ? "销量" : "利润 (¥)"]} />
          <Legend />
          <ReferenceLine x={289.99} stroke="red" strokeDasharray="3 3" label="建议价格" />
          <Line yAxisId="left" type="monotone" dataKey="销量" stroke="#3b82f6" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="利润" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

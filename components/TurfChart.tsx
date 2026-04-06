'use client'

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import type { TurfRowResult } from '@/lib/types'

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export default function TurfChart({ results }: { results: TurfRowResult[] }) {
  const data = results.map((row) => ({
    k: row.k,
    reachPct: Number((row.reachPct * 100).toFixed(1))
  }))

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#dbe4f0" strokeDasharray="3 3" />
          <XAxis dataKey="k" tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            width={56}
          />
          <Tooltip formatter={(value: number) => percent(value / 100)} labelFormatter={(label) => `Размер набора: ${label}`} />
          <Line
            type="monotone"
            dataKey="reachPct"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2563eb' }}
            activeDot={{ r: 6 }}
          >
            <LabelList dataKey="reachPct" position="top" formatter={(value: number) => `${value}%`} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import type { TurfRowResult } from '@/lib/types'

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export default function TurfChart({ results }: { results: TurfRowResult[] }) {
  // 🔥 находим "точку перелома"
  const optimalPoint =
    results.find((r, i) => i > 0 && r.incrementalReachPct < 0.05) ??
    results[results.length - 1]

  const data = results.map((r) => ({
    k: r.k,
    reach: r.reachPct,
    incremental: r.incrementalReachPct,
    label: r.bestCombinationLabels.join(', ')
  }))

  return (
    <div className="space-y-4">
      <div className="h-[320px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey="k"
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5f5' }}
            />

            <YAxis
              tickFormatter={percent}
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5f5' }}
            />

            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                percent(value),
                'Охват'
              ]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload
                return `k = ${label}`
              }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '12px'
              }}
            />

            {/* линия */}
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* 🔥 вертикальная линия оптимального k */}
            <ReferenceLine
              x={optimalPoint.k}
              stroke="#ef4444"
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 пояснение */}
      <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Рекомендуемое количество атрибутов — около <b>{optimalPoint.k}</b>, так как после этого прирост охвата становится незначительным.
      </div>
    </div>
  )
}

'use client'

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
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
    reachPct: row.reachPct,
    incrementalReachPct: row.incrementalReachPct,
    labels: row.bestCombinationLabels
  }))

  const recommendedPoint =
    results.find((row, index) => index > 0 && row.incrementalReachPct < 0.05) ??
    results[results.length - 1]

  return (
    <div className="space-y-4">
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 24, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="k"
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={percent}
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null

                const point = payload[0]?.payload
                if (!point) return null

                return (
                  <div className="max-w-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                    <div className="text-sm font-semibold text-slate-800">
                      Размер набора: {point.k}
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Охват: <span className="font-medium">{percent(point.reachPct)}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Атрибуты:
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">
                      {point.labels.join(', ')}
                    </div>
                  </div>
                )
              }}
            />

            <ReferenceLine
              x={recommendedPoint.k}
              stroke="#dc2626"
              strokeDasharray="5 5"
            />

            <Line
              type="monotone"
              dataKey="reachPct"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#2563eb' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: '#1d4ed8' }}
            >
              <LabelList
                dataKey="reachPct"
                position="top"
                formatter={(value: number) => percent(value)}
                style={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
        <div className="font-semibold">
          Рекомендуемое количество атрибутов: {recommendedPoint.k}
        </div>
        <div className="mt-1">
          После этого шага прирост охвата становится неинтенсивным, поэтому дальнейшее расширение набора обычно даёт ограниченный дополнительный эффект.
        </div>
      </div>
    </div>
  )
}

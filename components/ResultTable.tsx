import type { TurfResponse } from '@/lib/types'

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export default function ResultTable({ data }: { data: TurfResponse }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Размер набора (k)</th>
              <th className="px-4 py-3 font-semibold">Лучшая комбинация</th>
              <th className="px-4 py-3 font-semibold">Охват, n</th>
              <th className="px-4 py-3 font-semibold">Охват, %</th>
              <th className="px-4 py-3 font-semibold">Прирост к прошлому шагу</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((row) => (
              <tr key={row.k} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-semibold text-slate-900">{row.k}</td>
                <td className="px-4 py-3 text-slate-800">{row.bestCombinationLabels.join(', ')}</td>
                <td className="px-4 py-3 text-slate-800">{row.reachCount}</td>
                <td className="px-4 py-3 text-slate-800">{percent(row.reachPct)}</td>
                <td className="px-4 py-3 text-slate-800">{row.k === 1 ? '-' : percent(row.incrementalReachPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

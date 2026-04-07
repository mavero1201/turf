import type { TurfResponse } from '@/lib/types'

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export default function ResultTable({ data }: { data: TurfResponse }) {
  // логика определения recommended k (та же, что в графике)
  const slowdownIndex = data.results.findIndex(
    (row, index) => index > 0 && row.incrementalReachPct < 0.05
  )

  const recommendedK =
    slowdownIndex > 0
      ? data.results[slowdownIndex - 1]?.k
      : data.results[data.results.length - 1]?.k

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
            {data.results.map((row) => {
              const isRecommended = row.k === recommendedK

              return (
                <tr
                  key={row.k}
                  className={`border-t align-top transition-all ${
                    isRecommended
                      ? 'bg-blue-50/70 ring-1 ring-blue-200'
                      : 'border-slate-100 hover:bg-slate-50/60'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {row.k}
                    {isRecommended ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">
                        recommended
                      </span>
                    ) : null}
                  </td>

                  <td className="px-4 py-3 text-slate-800">
                    {row.bestCombinationLabels.join(', ')}
                  </td>

                  <td className="px-4 py-3 text-slate-800">{row.reachCount}</td>

                  <td className="px-4 py-3 text-slate-800">
                    {percent(row.reachPct)}
                  </td>

                  <td className="px-4 py-3 text-slate-800">
                    {row.k === 1 ? '-' : percent(row.incrementalReachPct)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

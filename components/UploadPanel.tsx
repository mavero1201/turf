'use client'

import { useMemo, useState } from 'react'
import { BarChart3, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import ResultTable from '@/components/ResultTable'
import TurfChart from '@/components/TurfChart'
import InterpretationCard from '@/components/InterpretationCard'
import type { TurfResponse } from '@/lib/types'

const ACCEPT = '.xlsx'

export default function UploadPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [maxK, setMaxK] = useState(3)
  const [submittedMaxK, setSubmittedMaxK] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TurfResponse | null>(null)

  const fileLabel = useMemo(() => file?.name ?? 'Файл ещё не выбран', [file])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)

    if (!file) {
      setError('Сначала загрузите файл .xlsx.')
      return
    }

    const safeMaxK = Math.max(1, Math.floor(maxK || 1))
    setSubmittedMaxK(safeMaxK)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('maxK', String(safeMaxK))

    setIsLoading(true)

    try {
      const response = await fetch('/api/turf', {
        method: 'POST',
        body: formData
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Не удалось рассчитать TURF.')
      }

      setResult(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось рассчитать TURF.')
    } finally {
      setIsLoading(false)
    }
  }

  const wasKAdjusted =
    result &&
    submittedMaxK !== null &&
    submittedMaxK > result.meta.maxK

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Загрузка данных</h2>
              <p className="text-sm text-slate-600">
                Файл Excel (.xlsx), первый лист. Первая строка - названия атрибутов, со второй строки - данные респондентов 0/1.
              </p>
            </div>
          </div>

          <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
            <input
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <FileSpreadsheet className="mb-3 h-10 w-10 text-slate-500" />
            <div className="text-base font-semibold text-slate-800">Выберите файл</div>
            <div className="mt-1 text-sm text-slate-600">Поддерживается формат .xlsx</div>
            <div
              className="mt-4 max-w-full truncate rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
              title={fileLabel}
            >
              {fileLabel}
            </div>
          </label>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Параметры расчёта</h2>
              <p className="text-sm text-slate-600">Точный расчёт без весов и без frequency.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="maxK" className="mb-2 block text-sm font-medium text-slate-700">
                Максимальный размер набора (k)
              </label>
              <input
                id="maxK"
                type="number"
                min={1}
                value={maxK}
                onChange={(event) => setMaxK(Number(event.target.value) || 1)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Рекомендуемое количество атрибутов для анализа - 3-5. При больших значениях расчёт может заметно замедляться.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Считаем TURF...' : 'Рассчитать TURF'}
            </button>

            <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
              Текущая версия принимает бинарные данные 0/1. Первая строка используется как названия атрибутов. Расчёт выполняется точным перебором комбинаций, поэтому при большом числе атрибутов и высоком max k время обработки может увеличиваться.
            </div>
          </div>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          {wasKAdjusted ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Вы указали k = {submittedMaxK}, но в загруженном файле доступно только {result.meta.options} атрибутов. Поэтому расчёт выполнен с максимально возможным значением k = {result.meta.maxK}.
            </div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Респонденты" value={String(result.meta.respondents)} />
            <MetricCard label="Атрибуты" value={String(result.meta.options)} />
            <MetricCard label="Max k" value={String(result.meta.maxK)} />
            <MetricCard label="Файл" value={result.meta.fileName ?? '-'} small />
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Оптимальные комбинации по размеру набора</h2>
            <ResultTable data={result} />
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-md">
            <h2 className="mb-2 text-lg font-semibold text-slate-800">Кривая накопленного охвата</h2>
            <p className="mb-4 text-sm text-slate-600">
              График показывает максимальный уникальный охват для каждого размера оптимального набора.
            </p>
            <TurfChart results={result.results} />
            <div className="mt-4">
              <InterpretationCard />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md transition hover:shadow-lg">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-2 font-semibold text-slate-800 ${small ? 'text-base break-all' : 'text-2xl'}`}>{value}</div>
    </div>
  )
}
